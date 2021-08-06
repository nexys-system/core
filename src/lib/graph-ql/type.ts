import * as GL from 'graphql';

export interface DdlInput {
  name: string;
  uuid?: boolean;
  fields: { name: string; type: string }[];
}

export interface Ddl {
  name: string;
  fields: { name: string; type: string }[];
}

export interface Args {
  [field: string]: { type: GL.GraphQLScalarType };
}
