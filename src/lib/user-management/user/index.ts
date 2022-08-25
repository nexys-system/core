import { QueryFilters, QueryParams } from "@nexys/fetchr/dist/type";
import { Locale } from "../../middleware/auth/type";
import * as T from "../type";
import QueryService from "../../query/abstract-service";
import * as U from "../utils";
import * as CT from "../crud-type";
import PermissionService from "../permission";
import * as L from "../locale";

type Uuid = string;
interface UOptionSet {
  uuid: Uuid;
  name: string;
}

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
    locale: Locale;
    UserAuthentication?: CT.UserAuthentication[];
  }> => this.getByAttribute({ key: "uuid", value: uuid }, instanceIn);

  getByEmail = async (
    email: string,
    instanceIn?: { uuid: Uuid }
  ): Promise<{
    profile: T.Profile;
    status: T.Status;
    locale: Locale;
    UserAuthentication?: CT.UserAuthentication[];
  }> => this.getByAttribute({ key: "email", value: email }, instanceIn);

  getByAttribute = async (
    attribute: { key: "email" | "uuid"; value: string },
    instanceIn?: { uuid: Uuid }
  ): Promise<{
    profile: T.Profile;
    status: T.Status;
    locale: Locale;
    UserAuthentication?: CT.UserAuthentication[];
  }> => {
    const params: QueryParams = {
      projection: {
        uuid: true,
        firstName: true,
        lastName: true,
        email: true,
        localeLang: true,
        localeCountry: true,
        status: true,
        instance: { uuid: true, name: true },
      },
      filters: {
        [attribute.key]: attribute.value,
      },
      references: {
        [U.Entity.UserAuthentication]: {
          projection: { uuid: true, type: true, value: true, isEnabled: true },
        },
      },
    };

    if (
      instanceIn &&
      params.filters // this is to avoid type error, but filters is always defined
    ) {
      params.filters.instance = { uuid: instanceIn.uuid };
    }

    // get user with associated authentication methods
    const {
      uuid,
      firstName,
      lastName,
      email,
      localeLang,
      localeCountry,
      status,
      instance,
      UserAuthentication,
    }: {
      uuid: Uuid;
      firstName: string;
      lastName: string;
      email: string;
      localeLang?: string;
      localeCountry?: string;
      status: T.Status;
      instance: UOptionSet;
      UserAuthentication?: CT.UserAuthentication[];
    } = await this.qs.find(U.Entity.User, params, false);

    const locale: Locale = {
      country: localeCountry || L.countryDefault,
      lang: localeLang || L.langDefault,
    };

    const profile: T.Profile = { uuid, firstName, lastName, email, instance };

    return { profile, status, locale, UserAuthentication };
  };

  getAuthenticationRow = async (
    type: CT.AuthenticationType,
    value: string,
    instance: { uuid: string }
  ): Promise<CT.UserAuthentication> => {
    const params = { filters: { type, value, user: { instance } } };
    try {
      return await this.qs.find<CT.UserAuthentication>(
        U.Entity.UserAuthentication,
        params,
        false
      );
    } catch (err) {
      console.error(err);
      return Promise.reject(
        "could not find user authentication row: " + JSON.stringify(params)
      );
    }
  };

  getUserByAttributeWithAuth = async (
    attribute: { key: "uuid" | "email"; value: string },
    instanceIn?: { uuid: Uuid },
    authType: CT.AuthenticationType = CT.AuthenticationType.password
  ): Promise<{
    profile: T.Profile;
    status: T.Status;
    locale: Locale;
    auth: { uuid: Uuid; value: string };
  }> => {
    try {
      const { profile, status, locale, UserAuthentication } =
        await this.getByAttribute(attribute, instanceIn);

      const userAuthentication = UserAuthentication?.find(
        (x) => x.type === authType
      );

      if (!userAuthentication) {
        throw new Error(`account does not exist`);
      }

      return {
        profile,
        status,
        locale,
        auth: {
          uuid: userAuthentication.uuid,
          value: userAuthentication.value,
        },
      };
    } catch (err) {
      console.log(err);
      throw Error(
        "no user could be found with attribute: " + JSON.stringify(attribute)
      );
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
    profile: Omit<T.Profile, "uuid" | "instance"> & {
      instance: { uuid: string };
    },
    _locale: Locale,
    status: T.Status = T.Status.pending
  ): Promise<{ uuid: Uuid }> => {
    const row: Omit<CT.User, "uuid"> = {
      ...profile,
      status,
      logDateAdded: new Date(),
    };

    const { uuid } = await this.qs.insertUuid(U.Entity.User, row);

    return { uuid };
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

  exists = async (
    email: string,
    instance?: { uuid: string }
  ): Promise<boolean> => {
    const filters: QueryFilters = { email };

    if (instance) {
      filters.instance = instance;
    }

    const params: QueryParams = { filters };

    const d = await this.qs.find(U.Entity.User, params, true);

    return !!d;
  };
}
