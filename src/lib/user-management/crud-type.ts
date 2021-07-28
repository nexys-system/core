import { Uuid } from "@nexys/utils/dist/types";
import { Status } from "./type";

export interface User {
  uuid: Uuid;
  firstName: string;
  lastName: string;
  email: string;
  status: Status;
  localeLang?: string;
  localeCountry?: string;
  logDateAdded: Date;
  instance: { uuid: Uuid } | Instance;
}

export interface UserToken {
  uuid: Uuid;
  token: string;
  logDateAdded: Date;
  user: { uuid: Uuid };
  userAgent?: string;
  ip?: string;
}

export enum AuthenticationType {
  password = 1,
  google = 2,
  github = 3,
}

export interface UserAuthentication {
  uuid: Uuid;
  value: string;
  isEnabled: boolean;
  type: AuthenticationType;
  user: { uuid: Uuid } | User;
}

export interface Instance {
  uuid: Uuid;
  name: string;
  dateAdded: Date;
}

export interface Permission {
  uuid: Uuid;
  name: string;
  description?: string;
}

export interface UserPermission {
  uuid: Uuid;
  permissionInstance: { uuid: Uuid } | PermissionInstance;
  user: { uuid: Uuid } | User;
}

export interface PermissionInstance {
  uuid: Uuid;
  instance: { uuid: Uuid } | Instance;
  permission: { uuid: Uuid } | Permission;
}