// This code was generated automatically via the Nexys platform on Thu Jan 13 2022 19:37:02 GMT+0000 (Coordinated Universal Time), do not alter, regenerate if needed
// version v4
export type Id = number;
export type Uuid = string;

export interface Person {
  uuid: Uuid,
  firstName?: string,
  lastName?: string,
  birthDate?: Date,
  deathDate?: Date,
  sex?: number,
  birthLocation?: string
}

export interface PersonConnection {
  uuid: Uuid,
  source: {uuid: Uuid} | Person,
  target: {uuid: Uuid} | Person,
  type: number
}

export interface User {
  uuid: Uuid,
  firstName: string,
  lastName: string,
  email: string,
  logDateAdded: Date,
  instance: {uuid: Uuid} | Instance,
  localeLang?: string,
  status: number,
  localeCountry?: string
}

export interface UserAuthentication {
  uuid: Uuid,
  value: string,
  isEnabled: boolean,
  user: {uuid: Uuid} | User,
  type: number
}

export interface Instance {
  uuid: Uuid,
  name: string,
  logDateAdded: Date
}

export interface UserPermission {
  uuid: Uuid,
  permissionInstance: {uuid: Uuid} | PermissionInstance,
  user: {uuid: Uuid} | User
}

export interface PermissionInstance {
  uuid: Uuid,
  instance: {uuid: Uuid} | Instance,
  permission: number
}

export interface UserToken {
  uuid: Uuid,
  user: {uuid: Uuid} | User,
  token: string,
  logDateAdded: Date,
  ip?: string,
  userAgent?: string
}

export namespace OptionSets {
  export enum Country {
    One = 1,
    Two = 2,
  }

  export enum MyOptionSet {
    jk = 1,
    ghjkl = 2,
  }
}

export enum Permissions {
  app = 1,
  admin = 2,
  superadmin = 3,
  one = 4,
  two = 5,
}