import { GraphQLSchema } from "graphql";

import { Permission } from "../user-management/crud-type";
import FetchR from "@nexys/fetchr";

import * as SchemaFactory from "./schema-factory";
import * as GraphQLSubmodelService from "./submodel";

import { Ddl } from "./type";

const roleMap: Map<string, Permission> = new Map(
  Object.entries(Permission)
    .filter(([_k, v]) => typeof v !== "number")
    .map(([k, v]) => [v as string, Number(k) as Permission])
);

class GQLSchema {
  roleQLSchemaMap: Map<
    Permission,
    (ids: { Instance: string; User: string }) => GraphQLSchema
  >;

  // superadmin gql schema
  gQLSchema: GraphQLSchema;

  constructor(model: Ddl[], fetchR: FetchR) {
    console.log("init");
    // app schema
    const appConstraints = GraphQLSubmodelService.createAppConstraint(model);

    const gQLAppSchema = (ids: { Instance: string; User: string }) =>
      SchemaFactory.getSchemaFromModel(model, fetchR, appConstraints(ids));

    // admin
    const adminConstraints =
      GraphQLSubmodelService.createAdminConstraints(model);

    const gQLAdminSchema = (ids: { Instance: string; User: string }) =>
      SchemaFactory.getSchemaFromModel(model, fetchR, adminConstraints(ids));

    // superadmin schema, which is also the one that is used with the "app authentication"
    this.gQLSchema = SchemaFactory.getSchemaFromModel(model, fetchR);

    this.roleQLSchemaMap = new Map([
      [Permission.app, gQLAppSchema],
      [Permission.admin, gQLAdminSchema],
      [Permission.superadmin, () => this.gQLSchema],
    ]);
  }

  getSchemaFromCtx = (ctx: any): GraphQLSchema => {
    const { role } = ctx.params;

    const permission = roleMap.get(role);

    if (!permission) {
      throw { code: 400, msg: `Role "${role}" does not exist` };
    }

    const preSchema = this.roleQLSchemaMap.get(permission);

    if (!preSchema) {
      throw { code: 400, msg: `Schema for role "${role}" does not exist` };
    }

    const {
      profile,
      userCache: { permissions },
    } = ctx.state;

    if (!permissions.includes(permission)) {
      throw { code: 400, msg: "not allowed to access this resource" };
    }

    const ids = { User: profile.uuid, Instance: profile.instance.uuid };

    return preSchema(ids);
  };
}

export default GQLSchema;
