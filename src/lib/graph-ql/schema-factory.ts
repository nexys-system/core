import * as GL from "graphql";
import * as T from "./type";
import * as U from "./utils";

import QueryService from "../query/service";

const mapTypes = (t: string): GL.GraphQLScalarType => {
  if (t === "Int") {
    return GL.GraphQLInt;
  }

  if (t === "string") {
    return GL.GraphQLString;
  }

  return GL.GraphQLString;
};

export const getQueryFromJSONDDL = (
  def: T.Ddl[],
  ProductQuery: QueryService
): GL.GraphQLObjectType => {
  const QLtypes: Map<
    string,
    { objectType: GL.GraphQLObjectType; args: T.Args }
  > = new Map();

  def.forEach((entity) => {
    const fields: T.Args = {};

    entity.fields.forEach((f) => {
      fields[f.name] = { type: mapTypes(f.type) };
    });

    const objectType = new GL.GraphQLObjectType({
      name: entity.name,
      fields,
    });

    QLtypes.set(entity.name, { objectType, args: fields });
  });

  const getType = (entity: string): GL.GraphQLObjectType => {
    const r = QLtypes.get(entity);
    //console.log(r);
    //console.log(entity);

    if (!r || !r.objectType) {
      throw Error("sdf");
    }

    return r.objectType;
  };

  const getArgs = (entity: string): T.Args => {
    const r = QLtypes.get(entity);

    if (!r || !r.args) {
      throw Error("sdf");
    }

    return {
      ...r.args,
      _take: { type: GL.GraphQLInt },
      _skip: { type: GL.GraphQLInt },
    };
  };

  const objectType: GL.Thunk<GL.GraphQLFieldConfigMap<any, any>> = {};

  def.forEach((entity) => {
    objectType[entity.name] = {
      type: new GL.GraphQLList(getType(entity.name)),
      args: getArgs(entity.name),
      resolve: (_: any, { _take, _skip, ...filters }: any) => {
        //const take = 10;
        //console.log(_take);
        //console.log(filters);
        return ProductQuery.list(entity.name, {
          projection: {},
          filters,
          take: _take,
          skip: _skip,
        });
      },
    };
  });

  const query: GL.GraphQLObjectType = new GL.GraphQLObjectType({
    name: "Query",
    fields: objectType,
  });

  return query;
};

export const getSchemaFromJSONDDL = (
  ddlInput: T.DdlInput[],
  ProductQuery: any
): GL.GraphQLSchema => {
  const ddl = U.ddl(ddlInput);
  const query = getQueryFromJSONDDL(ddl, ProductQuery);
  return new GL.GraphQLSchema({ query });
};
