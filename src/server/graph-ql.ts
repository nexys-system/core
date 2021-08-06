import Router from "koa-router";
import bodyParser from "koa-body";
//import Auth from '../../middleware/auth';

import * as GraphQL from "../lib/graph-ql";
import { graphql, printSchema } from "graphql";
import { DdlInput } from "../lib/graph-ql/type";
import QueryService from "../lib/query/service";

export class GraphQLFromModel {
  model: DdlInput[];
  queryService: any;
  constructor(model: DdlInput[], queryService: QueryService) {
    this.model = model;
    this.queryService = queryService;
  }

  getSchema = () =>
    GraphQL.SchemaFactory.getSchemaFromJSONDDL(this.model, this.queryService);

  //getQuery = () =>
  //GraphQL.SchemaFactory.getQueryFromJSONDDL(this.model, this.queryService);
}

export const getGraphQLRoutes = (G: GraphQLFromModel) => {
  const router: Router = new Router();

  router.all(
    "/schema",
    bodyParser(),
    //Auth.isAuthorized("superadmin"),
    //middlewareRoleExists,
    async (ctx) => {
      ctx.body = printSchema(G.getSchema());
    }
  );

  router.post(
    "/",
    bodyParser(),
    //Auth.isAuthorized("superadmin"),
    //middlewareRoleExists,
    async (ctx) => {
      const { body } = ctx.request;
      const { query } = body;
      ctx.body = await graphql(G.getSchema(), query);
    }
  );

  return router.routes();
};
