import { Uuid } from "@nexys/utils/dist/types";
import { QueryService } from "./type";
import UserService from "./user";
import UserTokenService from "./user/token";
import * as U from "./password/utils";
import * as T from "./type";
import * as A from "./action-payload";
import { Locale } from "../middleware/auth/type";

export default class LoginService {
  userService: UserService;
  userTokenService: UserTokenService;
  secretKey: string;
  constructor(qs: QueryService, secretKey: string) {
    this.userService = new UserService(qs);
    this.userTokenService = new UserTokenService(qs);
    this.secretKey = secretKey;
  }

  /**
   * authenticates a user
   * @param password [optional] if login via password, password is required
   */
  authenticate = async (
    email: string,
    instance: { uuid: Uuid },
    { userAgent, ip }: { userAgent?: string; ip: string },
    password?: string
  ): Promise<{
    profile: T.Profile;
    locale: Locale;
    permissions: string[];
    refreshToken: string;
  }> => {
    const { profile, status, locale, auth } =
      await this.userService.getUserByEmailWithAuth(email, instance);

    if (status !== T.Status.active) {
      throw new Error(`status not ok`);
    }

    if (
      typeof password === "string" &&
      !(await U.matchPassword(password, auth.value))
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
    permissions: string[] = []
  ): Promise<{ uuid: Uuid; authentication: { uuid: Uuid }; token: string }> => {
    if (await this.userService.exists(profile.email)) {
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
    permissions: string[];
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
