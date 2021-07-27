import * as T from "./type";

export const userUuid = "myUuid";
export const email = "john@doe.com";

export const permissions = ["app", "admin"];
export const profile: T.Profile = {
  uuid: userUuid,
  firstName: "John",
  lastName: "Doe",
  email,
  lang: "en",
  instance: { uuid: "instanceUuid", name: "instance" },
};

export const status = T.Status.pending;

export const hashedPassword = "myhashedpassword";

class QueryService extends T.QueryService {
  constructor(host: string, token: string) {
    super();
  }

  insertUuid = <A>(entity: string, data: A) =>
    Promise.resolve({
      uuid: entity + "_uuid",
      success: true,
    });

  list = <A = any>(entity: string, _query: any): Promise<A[]> => {
    if (entity === "UserPermission") {
      return Promise.resolve([
        { permissionInstance: { permission: { name: "app" } } },
        { permissionInstance: { permission: { name: "admin" } } },
      ] as any as A[]);
    }
    return Promise.resolve([]);
  };

  find = (entity: string, _query: any) => {
    if (entity === "User") {
      return Promise.resolve({
        ...profile,
        status,
        UserAuthentication: [
          {
            value: hashedPassword,
            type: { id: 1, name: "password" },
            isEnabled: true,
          },
        ],
      }) as any;
    }

    throw Error("not impolemented");
  };

  detail = <A>(): Promise<A> => Promise.resolve({} as A);
  insert = <A>() => {
    throw Error("undefined");
  };
  insertMultiple = () => {
    throw Error("undefined");
  };
  update = () => {
    throw Error("undefined");
  };
  delete = () => {
    throw Error("undefined");
  };
}

export const qs = new QueryService("host", "token");

export default QueryService;
