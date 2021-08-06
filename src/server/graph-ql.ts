import Router from "koa-router";
import bodyParser from "koa-body";
import * as Auth from "../lib/middleware/auth";

import { graphql, printSchema, GraphQLSchema } from "graphql";

export const getGraphQLRoutes = (
  gQLschema: GraphQLSchema,
  appToken: string
) => {
  const router: Router = new Router();

  const auth = new Auth.App.default(appToken);

  router.all(
    "/schema",
    bodyParser(),
    auth.isAuthenticated,

    async (ctx) => {
      ctx.body = printSchema(gQLschema);
    }
  );

  router.post(
    "/",
    bodyParser(),
    auth.isAuthenticated,

    async (ctx) => {
      const { body } = ctx.request;
      const { query } = body;
      ctx.body = await graphql(gQLschema, query);
    }
  );

  return router.routes();
};
