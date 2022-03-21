import * as T from "../../../user-management/crud-type";
import { AuthenticationType } from "../../../user-management/crud-type";

type Uuid = string;

type ProfileCore = Pick<T.User, "firstName" | "lastName">;
export type Profile = ProfileCore & {
  id: Uuid;
  uuid: Uuid;
};

export interface Auth {
  type?: AuthenticationType;
  value?: string;
  password?: string;
}

export type Signup = ProfileCore & {
  email: string;
  auth: Auth;
};
