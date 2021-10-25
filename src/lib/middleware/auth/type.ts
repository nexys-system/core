import * as T from "../../type";

export type Permission = number;

export interface Permissions<P = Permission> {
  permissions: P[];
}

export interface UserState<
  Id,
  Profile extends T.ObjectWithId<Id>,
  UserCache extends UserCacheDefault
> {
  profile: Profile;
  userCache: UserCache;
}

export interface LoginResponse<
  Profile extends T.ObjectWithId<Id>,
  Id,
  P = Permission
> {
  permissions: P[];
  profile: Profile;
  locale: string;
  accessToken: string;
  refreshToken: string;
}

export interface Locale {
  country: string;
  lang: string;
}

export interface UserCacheDefault extends Permissions {
  locale: Locale;
}
