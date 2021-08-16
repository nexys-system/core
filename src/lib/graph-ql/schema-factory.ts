import graphqlFields from "graphql-fields";

import * as GL from "graphql";
import * as T from "./type";
import * as U from "./utils";
import * as UM from "./utils-mapping";

import QueryService from "../query/service";
import { QueryFilters, QueryProjection } from "@nexys/fetchr/dist/type";

export interface Model {
  [entity: string]: { projection?: {}; filters?: QueryFilters };
}

export const createTypesFromModel = (def: T.Ddl[]): T.GLTypes => {
  const QLtypes: T.GLTypes = new Map();

  const entities = [...def];

  let i = 0;
  const index0 = 0;
  const maxIteration = 1000; // to avoid an infinite loop, in most cases (logically) after i = entities.length*2 it should be done
  while (entities.length > 0 && i < maxIteration) {
    i++;
    // observed entity - remove entity from array
    const entity = entities.splice(index0, 1)[0];

    // find fields that are foreign keys (not standard fields)
    const fieldsTypeFk: string[] = entity.fields
      .filter((f) => !U.isFieldType(f.type))
      .map((x) => x.type);

    // among the foreign keys fields, look if they were already handled,
    // if yes the observed entity can be hjandled since all fks are already present
    const canBeHandled = fieldsTypeFk
      .map((entity) => entities.find((e) => e.name === entity))
      .map((x) => x === undefined)
      .reduce((a, b) => a && b, true);

    //console.log({ entity: entity.name, fieldsTypeFk, f1, f2, f3 });

    if (!canBeHandled) {
      // observed entity cannot be handled
      // adding current entity at the end
      entities.push(entity);
      // abort, go to next iteration
      continue;
    }

    // console.log("entering " + entity.name);
    const fields: GL.GraphQLFieldConfigMap<any, any> = {};

    entity.fields.forEach((f) => {
      const pType = UM.mapOutputType(entity.name, f, QLtypes);

      if (pType) {
        const type = f.optional === true ? pType : new GL.GraphQLNonNull(pType);

        fields[f.name] = { type };
      }
    });

    const objectType = new GL.GraphQLObjectType({
      name: entity.name,
      fields,
    });

    // args
    const args: GL.GraphQLFieldConfigArgumentMap = {};

    entity.fields.forEach((f) => {
      const type = UM.mapInputType(f, def);

      args[f.name] = { type };
    });
    // end args

    QLtypes.set(entity.name, {
      objectType,
      args,
    });

    //
  }

  if (entities.length > 0) {
    throw Error(
      "something went wrong while trying to create the schema, most probably a circular reference. Entity array:" +
        JSON.stringify(entities)
    );
  }

  return QLtypes;
};

export const getQueryFromJSONDDL = (
  def: T.Ddl[],
  ProductQuery: QueryService,
  constraints?: Model
): GL.GraphQLObjectType => {
  const QLtypes: T.GLTypes = createTypesFromModel(def);

  const fields: GL.Thunk<GL.GraphQLFieldConfigMap<any, any>> = {};

  def.forEach((entity) => {
    fields[entity.name] = {
      type: new GL.GraphQLList(getType(entity.name, QLtypes)),
      args: getArgs(entity.name, QLtypes),

      resolve: (
        _data: any,
        { _take, _skip, ...queryFilters }: any,
        _context,
        resolveInfo
      ) => {
        const projection = formatGFields(graphqlFields(resolveInfo));

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

export const getSchemaFromJSONDDL = (
  ddlInput: T.Ddl[],
  ProductQuery: QueryService
): GL.GraphQLSchema => {
  const ddl = U.ddl(ddlInput);
  const query = getQueryFromJSONDDL(ddl, ProductQuery);
  return new GL.GraphQLSchema({ query });
};

interface GField {
  [field: string]: {} | GField;
}

const formatGFields = (a: GField): QueryProjection => {
  Object.keys(a).forEach((k) => {
    if (Object.keys(a[k]).length === 0) {
      a[k] = true;
    } else {
      formatGFields(a[k]);
    }
  });

  return a;
};

const getType = (entity: string, QLtypes: T.GLTypes): GL.GraphQLObjectType => {
  const r = QLtypes.get(entity);
  //console.log(r);
  //console.log(entity);

  if (!r || !r.objectType) {
    throw Error("could not find entity " + entity);
  }

  return r.objectType;
};

const getArgs = (
  entity: string,
  QLtypes: T.GLTypes
): GL.GraphQLFieldConfigArgumentMap => {
  const r = QLtypes.get(entity);

  if (!r || !r.args) {
    throw Error("could not find entity " + entity);
  }

  return {
    ...r.args,
    _take: { type: GL.GraphQLInt },
    _skip: { type: GL.GraphQLInt },
  };
};
