import * as N2FA from "@nexys/timebasedotp";
import { Locale } from "../middleware/auth/type";
import * as T from "./type";
import QueryService from "../query/abstract-service";
import UserService from "./user";
import UserTokenService from "./user/token";
import * as U from "./password/utils";
import * as A from "./action-payload";
import { AuthenticationType } from "./crud-type";

type Uuid = string;

export default class LoginService {
  userService: UserService;
  userTokenService: UserTokenService;
  secretKey: string;

  constructor(qs: QueryService, secretKey: string) {
    this.userService = new UserService(qs);
    this.userTokenService = new UserTokenService(qs);
    this.secretKey = secretKey;
  }

  preAuthenticate = async (
    username: string,
    instance: { uuid: Uuid },
    authMode: { type: AuthenticationType; password?: string }
  ): Promise<{
    profile: T.Profile;
    status: T.Status;
    locale: Locale;
    auth: { uuid: Uuid; value: string };
    faSecret?: string;
  }> => {
    if (authMode.type !== AuthenticationType.password) {
      const authRow = await this.userService.getAuthenticationRow(
        authMode.type,
        username,
        instance
      );

      return this.userService.getUserByAttributeWithAuth(
        { key: "uuid", value: authRow.user.uuid },
        instance,
        authMode.type
      );
    }

    return this.userService.getUserByAttributeWithAuth(
      { key: "email", value: username },
      instance
    );
  };

  /**
   * authenticates a user
   * @param password [optional] if login via password, password is required
   * @param username: typically the email but is also used for SSO login where it can be a username
   * @param authMode: indicates which type of authentication it is. `password` is only required if it is a password authentication mechanism
   */
  authenticate = async (
    username: string,
    instance: { uuid: Uuid },
    authMode: { type: AuthenticationType; password?: string },
    userMeta: T.UserMeta
  ): Promise<T.AuthOut | { payload: string; action: T.Action }> => {
    const { profile, status, locale, auth, faSecret } =
      await this.preAuthenticate(username, instance, authMode);

    if (status !== T.Status.active) {
      throw new Error(`status not ok`);
    }

    if (
      authMode.type === AuthenticationType.password &&
      typeof authMode.password === "string" &&
      !(await U.matchPassword(authMode.password, auth.value))
    ) {
      throw new Error(`email and password combination don't match`);
    }

    // if fa secret, process aborts and sends info encrypted, await 2fa
    if (!!faSecret) {
      const payload = A.createActionPayload(
        profile.uuid,
        { uuid: profile.instance.uuid },
        "2FA",
        this.secretKey
      );

      return { payload, action: "2FA" };
    }

    return this.toAuthOut(profile, locale, userMeta);
  };

  signup = async (
    profile: Omit<T.Profile, "uuid" | "instance"> & {
      instance: { uuid: string };
    },
    authentication: { type: AuthenticationType; value: string },
    locale: Locale,
    permissions: T.Permission[]
  ): Promise<{ uuid: Uuid; authentication: { uuid: Uuid }; token: string }> => {
    // make sure user does not exist
    const exists = await this.userService.exists(profile.email, {
      uuid: profile.instance.uuid,
    });

    if (exists) {
      return Promise.reject({ message: "User already exists" });
    }

    const { uuid } = await this.userService.insertByProfile(profile, locale);

    const authenticationOut =
      await this.userService.userAuthenticationService.insert({
        value: authentication.value,
        type: authentication.type,
        user: { uuid },
        isEnabled: true,
      });

    // add permisions
    this.userService.permissionService.assignToUserByNames(permissions, {
      uuid,
      instance: { uuid: profile.instance.uuid },
    });

    // create token to be able to send email and then change status
    const token = A.createActionPayload(
      uuid,
      { uuid: profile.instance.uuid },
      "SET_ACTIVE",
      this.secretKey
    );

    return { uuid, authentication: authenticationOut, token };
  };

  signupWPassword = async (
    profile: Omit<T.Profile, "uuid">,
    password: string,
    locale: Locale,
    permissions: T.Permission[]
  ): Promise<{ uuid: Uuid; authentication: { uuid: Uuid }; token: string }> => {
    // prepare password
    // note the password is hashed in the userAuthenticationService
    const authenticationInputs: { type: AuthenticationType; value: string } = {
      value: password,
      type: AuthenticationType.password,
    };

    const { uuid, authentication } = await this.signup(
      profile,
      authenticationInputs,
      locale,
      permissions
    );

    // create token to be able to send email and then change status
    const token = A.createActionPayload(
      uuid,
      { uuid: profile.instance.uuid },
      "SET_ACTIVE",
      this.secretKey
    );

    return { uuid, authentication: authentication, token };
  };

  /**
   * after the user clicks on the link to activate his account
   */
  activate = async (
    token: string
  ): Promise<{ success: boolean; message?: string }> => {
    const { uuid, instance } = A.decryptPayload(
      token,
      this.secretKey,
      "SET_ACTIVE"
    );

    const detail = await this.userService.detail(uuid, instance);

    if (detail.status !== T.Status.pending) {
      return {
        success: false,
        message:
          "the user does not have the right status, this action was probably already invoked",
      };
    }

    const success = await this.userService.changeStatusAdmin(
      uuid,
      instance,
      T.Status.active
    );
    return { success };
  };

  logout = async (uuid: Uuid, refreshToken?: string): Promise<boolean> => {
    if (!refreshToken) {
      return true;
    }

    return this.userTokenService.deleteByRefreshToken(uuid, refreshToken);
  };

  /**
   * when using refresh token
   */
  reAuthenticate = async (
    refreshToken: string
  ): Promise<{
    profile: T.Profile;
    permissions: T.Permission[];
    locale: Locale;
  }> => {
    const userUuid = await this.userTokenService.getFromRefreshToken(
      refreshToken
    );

    const { profile, status, locale } = await this.userService.getByUuid(
      userUuid
    );

    if (status !== T.Status.active) {
      throw new Error(`status not ok`);
    }

    const permissions =
      await this.userService.permissionService.permissionNamesByUser(
        profile.uuid
      );
    return { profile, permissions, locale };
  };

  authenticate2Fa = async (
    code: number,
    payload: string,
    userMeta: T.UserMeta
  ): Promise<T.AuthOut> => {
    const decrypted = A.decryptPayload(payload, this.secretKey);

    const { faSecret, profile, locale } = await this.userService.getByAttribute(
      { key: "uuid", value: decrypted.uuid },
      { uuid: decrypted.instance.uuid }
    );

    if (!faSecret) {
      throw Error("fa secret is undefined");
    }

    if (!N2FA.verifyTOTP(code, faSecret)) {
      throw Error("2FA unsuccessful");
    }

    return this.toAuthOut(profile, locale, userMeta);
  };

  toAuthOut = async (
    profile: T.Profile,
    locale: Locale,
    userMeta: T.UserMeta
  ) => {
    const { uuid: userId } = profile;
    const permissions =
      await this.userService.permissionService.permissionNamesByUser(userId);

    // create token
    const refreshToken = await this.userTokenService.create(userId, userMeta);

    return { profile, locale, permissions, refreshToken };
  };
}
