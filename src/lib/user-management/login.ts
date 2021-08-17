import { Uuid } from "@nexys/utils/dist/types";

import { Locale } from "../middleware/auth/type";

import * as T from "./type";
import { QueryService } from "./type";
import UserService from "./user";
import UserTokenService from "./user/token";
import * as U from "./password/utils";
import * as A from "./action-payload";
import { AuthenticationType } from "./crud-type";

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
  ) => {
    if (authMode.type !== AuthenticationType.password) {
      const authRow = await this.userService.getAuthenticationRow(
        authMode.type,
        username
      );

      return this.userService.getUserByAttributeWithAuth(
        { key: "uuid", value: authRow.user.uuid },
        instance
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
    { userAgent, ip }: { userAgent?: string; ip: string }
  ): Promise<{
    profile: T.Profile;
    locale: Locale;
    permissions: number[];
    refreshToken: string;
  }> => {
    const { profile, status, locale, auth } = await this.preAuthenticate(
      username,
      instance,
      authMode
    );

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

    const permissions =
      await this.userService.permissionService.permissionNamesByUser(
        profile.uuid
      );

    // create token
    const refreshToken = await this.userTokenService.create(profile.uuid, {
      userAgent,
      ip,
    });

    return { profile, locale, permissions, refreshToken };
  };

  signup = async (
    profile: Omit<T.Profile, "uuid">,
    password: string,
    locale: Locale,
    permissions: T.Permission[] = []
  ): Promise<{ uuid: Uuid; authentication: { uuid: Uuid }; token: string }> => {
    const exists = await this.userService.exists(profile.email);

    if (exists) {
      return Promise.reject({ message: "User already exists" });
    }

    const { uuid } = await this.userService.insertByProfile(profile, locale);

    const hashedPassword = await U.hashPassword(password);

    const authentication = await this.userService.insertAuth(
      uuid,
      hashedPassword
    );

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

    return { uuid, authentication, token };
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
}
