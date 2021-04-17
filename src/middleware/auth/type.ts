import { Uuid, OptionSet } from "@nexys/utils/dist/types";
import * as T from "../../type";

export interface Permissions {
  permissions: string[];
}

export interface UserState<
  Profile extends T.ObjectWithId,
  UserCache extends Permissions
> {
  profile: Profile;
  userCache: UserCache;
}

export interface LoginResponse<Profile extends T.ObjectWithId> {
  permissions: string[];
  profile: Profile;
  locale: OptionSet;
  accessToken: string;
  refreshToken: string;
}
