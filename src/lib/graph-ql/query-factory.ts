import graphqlFields from "graphql-fields";

import * as GL from "graphql";
import * as T from "./type";
import * as U from "./utils";

import QueryService from "../query/service";
import { QueryFilters } from "@nexys/fetchr/dist/type";
import { createTypesFromModel } from "./type-factory";

export const getQueryFromModel = (
  def: T.Ddl[],
  ProductQuery: QueryService,
  constraints?: T.Model
): GL.GraphQLObjectType => {
  const QLtypes: T.GLTypes = createTypesFromModel(def);

  const fields: GL.Thunk<GL.GraphQLFieldConfigMap<any, any>> = {};

  def.forEach((entity) => {
    fields[entity.name] = {
      type: new GL.GraphQLList(U.getType(entity.name, QLtypes)),
      args: U.getArgs(entity.name, QLtypes),

      resolve: (
        _data: any,
        { _take, _skip, ...queryFilters }: any,
        _context,
        resolveInfo
      ) => {
        const projection = U.formatGFields(graphqlFields(resolveInfo));

        // prepare filters
        if (constraints && !constraints[entity.name]) {
          return null;
        }

        const constraintsFilter: QueryFilters = constraints
          ? constraints[entity.name].filters || {}
          : {};

        const filters: QueryFilters = { ...constraintsFilter, ...queryFilters };
        // end prepare filters

        const take: number | undefined = Number(_take) || 10; // never return more than 10 entries unless explicitly specified
        const skip: number | undefined = _skip ? Number(_skip) : undefined;

        return ProductQuery.list(entity.name, {
          projection,
          filters,
          take,
          skip,
        });
      },
    };
  });

  const query: GL.GraphQLObjectType = new GL.GraphQLObjectType({
    name: "Query",
    fields,
  });

  return query;
};
