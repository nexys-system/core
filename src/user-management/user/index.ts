import { Uuid } from "@nexys/utils/dist/types";
import { QueryService } from "../type";
import * as U from "../utils";
import * as T from "../type";
import * as CT from "../crud-type";
import { UOptionSet } from "@nexys/utils/dist/types";
import PermissionService from "../permission";
import * as Status from "./status";
import { Params } from "@nexys/fetchr/dist/query-builder/aggregate/type";

export default class User {
  qs: QueryService;
  permissionService: PermissionService;
  constructor(qs: QueryService) {
    this.qs = qs;
    this.permissionService = new PermissionService(qs);
  }

  getByUuid = async (
    uuid: Uuid,
    instanceIn?: { uuid: Uuid }
  ): Promise<{
    profile: T.Profile;
    status: T.Status;
    UserAuthentication?: CT.UserAuthentication[];
  }> => this.getByAttribute({ key: "uuid", value: uuid }, instanceIn);

  getByEmail = async (
    email: string,
    instanceIn?: { uuid: Uuid }
  ): Promise<{
    profile: T.Profile;
    status: T.Status;
    UserAuthentication?: CT.UserAuthentication[];
  }> => this.getByAttribute({ key: "email", value: email }, instanceIn);

  getByAttribute = async (
    attribute: { key: "email" | "uuid"; value: string },
    instanceIn?: { uuid: Uuid }
  ): Promise<{
    profile: T.Profile;
    status: T.Status;
    UserAuthentication?: CT.UserAuthentication[];
  }> => {
    const params: any = {
      projection: {
        uuid: true,
        firstName: true,
        lastName: true,
        email: true,
        lang: true,
        status: true,
        instance: { uuid: true, name: true },
      },
      filters: {
        [attribute.key]: attribute.value,
        //instance:undefined// { uuid: instanceIn?.uuid || "" },
      },
      references: { [U.Entity.UserAuthentication]: {} },
    };

    if (instanceIn) {
      params.filters.instance = { uuid: instanceIn.uuid };
    }

    // get user with associated authentication methods
    const {
      uuid,
      firstName,
      lastName,
      email,
      lang,
      status,
      instance,
      UserAuthentication,
    }: {
      uuid: Uuid;
      firstName: string;
      lastName: string;
      email: string;
      lang: string;
      status: T.Status;
      instance: UOptionSet;
      UserAuthentication?: CT.UserAuthentication[];
    } = await this.qs.find(U.Entity.User, params, false);

    const profile = { uuid, firstName, lastName, email, lang, instance };

    return { profile, status, UserAuthentication };
  };

  getUserByEmailWithPassword = async (
    email: string,
    instanceIn?: { uuid: Uuid }
  ): Promise<{
    profile: T.Profile;
    status: T.Status;
    hashedPassword: string;
    auth: { uuid: Uuid };
  }> => {
    try {
      const { profile, status, UserAuthentication } = await this.getByEmail(
        email,
        instanceIn
      );

      const userAuthentication = UserAuthentication?.find(
        (x) => x.type.id === U.userAuthenticationPasswordId
      );

      if (!userAuthentication) {
        throw new Error(`account does not exist`);
      }

      const hashedPassword = userAuthentication.value;

      return {
        profile,
        status,
        hashedPassword,
        auth: { uuid: userAuthentication.uuid },
      };
    } catch (err) {
      throw Error("no user could be found with email: " + email);
    }
  };

  changeStatus = async (
    uuid: Uuid,
    status: T.Status = T.Status.active
  ): Promise<boolean> => {
    const r = await this.qs.update<CT.User>(
      U.Entity.User,
      { uuid },
      { status }
    );
    return r.success;
  };

  /**
   * for admin, instance rquired
   * @param uuid
   * @param status
   * @returns
   */
  changeStatusAdmin = async (
    uuid: Uuid,
    instance: { uuid: Uuid },
    status: T.Status = T.Status.active
  ): Promise<boolean> => {
    const r = await this.qs.update<CT.User>(
      U.Entity.User,
      { uuid, instance },
      { status }
    );
    return r.success;
  };

  changeEmail = async (
    uuid: Uuid,
    instance: { uuid: Uuid },
    email: string
  ): Promise<boolean> => {
    const r = await this.qs.update<CT.User>(
      U.Entity.User,
      { uuid, instance },
      { email }
    );
    return r.success;
  };

  insertByProfile = async (
    profile: Omit<T.Profile, "uuid">,
    status: T.Status = T.Status.pending
  ): Promise<{ uuid: Uuid }> => {
    const row: Omit<CT.User, "uuid"> = {
      ...profile,
      status,
      logDateAdded: new Date(),
    };

    const r = await this.qs.insertUuid(U.Entity.User, row);
    return { uuid: r.uuid };
  };

  insertAuth = async (
    uuid: Uuid,
    value: string,
    typeId: number = U.userAuthenticationPasswordId
  ): Promise<{ uuid: string }> => {
    const row: Omit<CT.UserAuthentication, "uuid"> = {
      type: { id: typeId },
      user: { uuid },
      isEnabled: true,
      value,
    };

    const r = await this.qs.insertUuid(U.Entity.UserAuthentication, row);

    return { uuid: r.uuid };
  };

  // admin functionalities

  list = async (instance: { uuid: Uuid }): Promise<CT.User[]> =>
    this.qs.list<CT.User>(U.Entity.User, {
      filters: { instance },
    });

  detail = async (uuid: Uuid, instance: { uuid: Uuid }): Promise<CT.User> => {
    const r = await this.qs.detail<CT.User>(U.Entity.User, uuid);

    if (!r || r.instance.uuid !== instance.uuid) {
      throw Error("user could not be found");
    }

    return r;
  };

  insert = async (row: Omit<CT.User, "uuid">): Promise<{ uuid: Uuid }> => {
    const r = await this.qs.insertUuid(U.Entity.User, row);

    return { uuid: r.uuid };
  };

  update = async (
    uuid: Uuid,
    row: Partial<CT.User>
  ): Promise<{ success: boolean }> => {
    const r = await this.qs.update(U.Entity.User, { uuid }, row);

    return r;
  };

  delete = async (uuid: Uuid): Promise<boolean> => {
    const r = await this.qs.delete(U.Entity.User, { uuid });

    return r.success;
  };
}
