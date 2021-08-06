import * as GL from "graphql";

export interface FieldOption {
  id: number;
  name: string;
}

export type FieldType =
  | "String"
  | "Boolean"
  | "Int"
  | "Float"
  | "LocalDateTime"
  | "LocalDate"
  | "BigDecimal";

export interface Field {
  name: string;
  type: FieldType | string;
  optional?: boolean;
  options?: FieldOption[];
}

export interface DdlInput {
  name: string;
  uuid?: boolean;
  fields: Field[];
}

export interface Ddl {
  name: string;
  fields: Field[];
}

export interface Args {
  [field: string]: { type: GL.GraphQLOutputType };
}

export type GLTypes = Map<
  string,
  { objectType: GL.GraphQLObjectType; args: Args }
>;
