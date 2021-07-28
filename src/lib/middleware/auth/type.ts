import * as T from "../../type";

export interface Permissions {
  permissions: string[];
}

export interface UserState<
  Id,
  Profile extends T.ObjectWithId<Id>,
  UserCache extends Permissions
> {
  profile: Profile;
  userCache: UserCache;
}

export interface LoginResponse<Profile extends T.ObjectWithId<Id>, Id> {
  permissions: string[];
  profile: Profile;
  locale: string;
  accessToken: string;
  refreshToken: string;
}

export interface Locale {
  country: string;
  lang: string;
}
