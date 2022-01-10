import * as TC from "./crud-type";

type Uuid = string;

interface UOptionSet {
  uuid: Uuid;
  name: string;
}

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
