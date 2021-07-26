import { Uuid } from "@nexys/utils/dist/types";
import { QueryService } from "./type";
import UserService from "./user";
import * as U from "./password/utils";
import * as T from "./type";
import * as A from "./action-payload";

export default class Login {
  userService: UserService;
  secretKey: string;
  constructor(qs: QueryService, secretKey: string) {
    this.userService = new UserService(qs);
    this.secretKey = secretKey;
  }

  authenticate = async (
    email: string,
    password: string,
    instance: { uuid: Uuid }
  ): Promise<{ profile: T.Profile; permissions: string[] }> => {
    const { profile, status, hashedPassword } =
      await this.userService.getUserByEmailWithPassword(email, instance);

    if (status.id !== T.Status.active) {
      throw new Error(`status not ok`);
    }

    if (!(await U.matchPassword(password, hashedPassword))) {
      throw new Error(`email and password combination don't match`);
    }

    const permissions =
      await this.userService.permissionService.permissionNamesByUser(
        profile.uuid
      );

    return Promise.resolve({ profile, permissions });
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
}
