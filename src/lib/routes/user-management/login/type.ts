import { Uuid } from "@nexys/utils/dist/types";
import { Permission } from "../../../middleware/auth/type";
import * as T from "../../../user-management/crud-type";

type ProfileCore = Pick<T.User, "firstName" | "lastName">;
export type Profile = ProfileCore & {
  id: Uuid;
  uuid: Uuid;
};

export type Signup = ProfileCore & {
  email: string;
  password: string;
};
