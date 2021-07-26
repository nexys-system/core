import { Uuid, OptionSet } from "@nexys/utils/dist/types";
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
  locale: OptionSet;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshToken<Profile> {
  profile: Profile;
  type: "REFRESH";
}
