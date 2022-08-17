import { AuthenticationType, Permission } from "./crud-type";
import * as T from "./type";
import AbstractQueryService from "../query/abstract-service";
import { Entity } from "./utils";
import { MutateResponseInsert } from "@nexys/fetchr/dist/type";

export const userUuid = "myUuid";
export const email = "john@doe.com";

export const permissions: Permission[] = [Permission.app, Permission.admin];
export const profile: T.Profile = {
  uuid: userUuid,
  firstName: "John",
  lastName: "Doe",
  email,
  instance: { uuid: "instanceUuid", name: "instance" },
};

export const status = T.Status.pending;

export const hashedPassword = "myhashedpassword";

class QueryService extends AbstractQueryService {
  constructor(_host: string, _token: string) {
    super();
  }

  insertUuid = <A>(entity: string, _data: A) =>
    Promise.resolve({
      uuid: entity + "_uuid",
      success: true,
    });

  insertId = <A>(_entity: string, _data: A) =>
    Promise.resolve({
      id: 0,
      success: true,
    });

  list = <A = any>(entity: string, _query: any): Promise<A[]> => {
    console.debug("mock: list", entity);
    if (entity === "UserPermission") {
      return Promise.resolve([
        { permissionInstance: { permission: Permission.app } },
        { permissionInstance: { permission: Permission.admin } },
      ] as any as A[]);
    }

    return Promise.resolve([]);
  };

  find = (entity: string, _query: any, b: boolean = false) => {
    if (entity === Entity.User) {
      if (b === true) {
        return Promise.resolve(null);
      }

      return Promise.resolve({
        ...profile,
        status,
        UserAuthentication: [
          {
            value: hashedPassword,
            type: AuthenticationType.password,
            isEnabled: true,
          },
        ],
      }) as any;
    }

    throw Error("not implemented");
  };

  detail = <A>(entity: string): Promise<A> => {
    console.debug("mock: detail", entity);
    throw Error("undefined");
  };

  insert = <_A>() => {
    console.debug("mock: insert");
    throw Error("undefined");
  };
  insertMultiple = (): Promise<MutateResponseInsert[]> => {
    console.debug("mock: insert Multiple");
    return Promise.resolve([{ success: true, uuid: "23" }]);
  };
  update = () => {
    console.debug("mock: update");
    throw Error("undefined");
  };
  delete = () => {
    console.debug("mock: delete");
    throw Error("undefined");
  };
}

export const qs = new QueryService("host", "token");

export default QueryService;
