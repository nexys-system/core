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

export interface Ddl {
  name: string;
  uuid?: boolean;
  fields: Field[];
}

export type GLTypes = Map<
  string,
  { objectType: GL.GraphQLObjectType; args: GL.GraphQLFieldConfigArgumentMap }
>;
