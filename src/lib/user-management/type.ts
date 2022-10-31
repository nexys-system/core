import { Locale } from "../middleware/auth/type";
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

export type Profile = Pick<TC.User, "firstName" | "lastName" | "email"> & {
  id: string;
  instance: UOptionSet;
};

export interface UserCache {
  permissions: Permission[];
}

export interface LoginResponse {
  profile: Profile;
  cacheData: UserCache;
}

export type Action = "SET_ACTIVE" | "RESET_PASSWORD" | "CHANGE_EMAIL" | "2FA";

export interface ActionPayload {
  id: Uuid;
  instance: { uuid: Uuid };
  action: Action;
  issued: number;
  expires: number;
}

export type UserListOut = Omit<TC.User, "status"> & {
  status: Status;
};

export interface AuthOut {
  profile: Profile;
  locale: Locale;
  permissions: Permission[];
  refreshToken: string;
}

export interface UserMeta {
  userAgent?: string;
  ip: string;
}
