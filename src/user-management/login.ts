import { Uuid } from "@nexys/utils/dist/types";
import { QueryService } from "./type";
import UserService from "./user";
import UserTokenService, { createRefreshToken } from "./user/token";
import * as U from "./password/utils";
import * as T from "./type";
import * as A from "./action-payload";

export default class LoginService {
  userService: UserService;
  userTokenService: UserTokenService;
  secretKey: string;
  constructor(qs: QueryService, secretKey: string) {
    this.userService = new UserService(qs);
    this.userTokenService = new UserTokenService(qs);
    this.secretKey = secretKey;
  }

  authenticate = async (
    email: string,
    password: string,
    instance: { uuid: Uuid },
    { userAgent, ip }: { userAgent?: string; ip: string }
  ): Promise<{
    profile: T.Profile;
    permissions: string[];
    refreshToken: string;
  }> => {
    const { profile, status, hashedPassword } =
      await this.userService.getUserByEmailWithPassword(email, instance);

    if (status !== T.Status.active) {
      throw new Error(`status not ok`);
    }

    if (!(await U.matchPassword(password, hashedPassword))) {
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

    return { profile, permissions, refreshToken };
  };

  signup = async (
    profile: Omit<T.Profile, "uuid">,
    password: string,
    permissions: string[] = []
  ): Promise<{ uuid: Uuid; authentication: { uuid: Uuid }; token: string }> => {
    const { uuid } = await this.userService.insertByProfile(profile);

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
  activate = async (token: string): Promise<boolean> => {
    const { uuid, instance } = A.decryptPayload(
      token,
      this.secretKey,
      "SET_ACTIVE"
    );

    return this.userService.changeStatusAdmin(uuid, instance, T.Status.active);
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
  }> => {
    const userUuid = await this.userTokenService.getFromRefreshToken(
      refreshToken
    );

    const { profile } = await this.userService.getByUuid(userUuid);
    const permissions =
      await this.userService.permissionService.permissionNamesByUser(
        profile.uuid
      );
    return { profile, permissions };
  };
}
