import { Uuid } from "@nexys/utils/dist/types";
import * as CT from "../type";

type ProfileCore = Pick<CT.User, "firstName" | "lastName">;
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
