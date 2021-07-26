import { UOptionSet, Uuid } from "@nexys/utils/dist/types";
import * as TC from "./crud-type";

export enum Status {
  active = 1,
  inactive = 3,
  pending = 2,
}

export type Profile = Pick<
  TC.User,
  "uuid" | "firstName" | "lastName" | "email" | "lang"
> & { instance: UOptionSet };

export interface UserCache {
  permissions: string[];
}

export interface LoginResponse {
  profile: Profile;
  cacheData: UserCache;
}

export type Action = "SET_ACTIVE" | "RESET_PASSWORD" | "CHANGE_EMAIL";

export interface ActionPayload {
  uuid: Uuid;
  instance: { uuid: Uuid };
  action: Action;
  issued: number;
  expires: number;
}

export type UserListOut = Omit<TC.User, "status"> & {
  status: { id: Status; name: string };
};

export interface QueryService {
  list<A = any>(entity: string, params?: any): Promise<A[]>;
  detail<A = any>(entity: string, params?: any): Promise<A>;
  find: <A>(entity: string, p: any, b?: boolean) => Promise<A>;
  insert<A>(entity: string, data: Omit<A, "id">): Promise<any>;
  insertUuid<A>(entity: string, data: Omit<A, "uuid">): Promise<any>;
  insertMultiple<A>(entity: string, data: Omit<A, "uuid">[]): Promise<any>;
  update<A>(entity: string, filters: Partial<A>, data: Partial<A>): any;
  delete: any;
}
