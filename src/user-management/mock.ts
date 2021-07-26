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

class QueryService {
  constructor(host: string, token: string) {}

  insertUuid = <A>(entity: string, data: A) =>
    Promise.resolve({
      uuid: entity + "_uuid",
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
      return {
        ...profile,
        status,
        UserAuthentication: [
          {
            value: hashedPassword,
            type: { id: 1, name: "password" },
            isEnabled: true,
          },
        ],
      };
    }
  };

  detail = <A>(): Promise<A> => Promise.resolve({} as A);
  insert = <A>() => Promise.resolve(undefined);
  insertMultiple = () => Promise.resolve(undefined);
  update = () => Promise.resolve(undefined);
  delete = () => Promise.resolve(undefined);
}

export const qs = new QueryService("host", "token");

export default QueryService;
