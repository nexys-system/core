import * as GL from "graphql";
import * as T from "./type";
import * as U from "./utils";

import QueryService from "../query/service";

import { getQueryFromModel } from "./query-factory";

/**
 *
 * @param def
 * @param ProductQuery
 * @param constraints
 * @returns
 */
export const getSchemaFromModel = (
  def: T.Ddl[],
  ProductQuery: QueryService,
  constraints?: T.Model
): GL.GraphQLSchema => {
  const ddl = U.ddl(def);
  const query = getQueryFromModel(ddl, ProductQuery, constraints);
  return new GL.GraphQLSchema({ query });
};
