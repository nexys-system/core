import { Uuid } from "@nexys/utils/dist/types";
import * as T from "../../../user-management/crud-type";

type ProfileCore = Pick<T.User, "firstName" | "lastName">;
export type Profile = ProfileCore & {
  id: Uuid;
  uuid: Uuid;
};

export interface UserCache {
  permissions: string[];
}

export type Signup = ProfileCore & {
  email: string;
  password: string;
};
