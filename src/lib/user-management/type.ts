import { UOptionSet, Uuid } from "@nexys/utils/dist/types";
import * as TC from "./crud-type";
import * as TQ from "@nexys/fetchr";

export type Permission = number;

export enum Status {
  active = 1,
  inactive = 3,
  pending = 2,
}

export type Profile = Pick<
  TC.User,
  "uuid" | "firstName" | "lastName" | "email"
> & { instance: UOptionSet };

export interface UserCache {
  permissions: Permission[];
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
  status: Status;
};

export abstract class QueryService {
  abstract list<A = any>(entity: string, params?: any): Promise<A[]>;

  abstract detail<A = any>(entity: string, params?: any): Promise<A>;

  abstract find<A = any>(
    entity: string,
    params: any,
    optional: boolean
  ): Promise<A>;

  abstract insert<A>(
    entity: string,
    data: Omit<A, "uuid" | "id">
  ): Promise<{ uuid: string } | { id: number }>;

  abstract insertId<A>(
    entity: string,
    data: Omit<A, "id">
  ): Promise<{ id: number }>;

  abstract insertUuid<A>(
    entity: string,
    data: Omit<A, "uuid">
  ): Promise<{ uuid: string }>;

  abstract insertMultiple<A>(
    entity: string,
    data: Omit<A, "uuid">[]
  ): Promise<TQ.Type.MutateResponseInsert[]>;

  abstract update<A>(
    entity: string,
    filters: Partial<A>,
    data: Partial<A>
  ): Promise<TQ.Type.MutateResponseUpdate>;

  abstract delete(a: any, b: any): Promise<TQ.Type.MutateResponseDelete>;
}
