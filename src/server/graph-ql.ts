import Router from "koa-router";
import bodyParser from "koa-body";
//import Auth from '../../middleware/auth';

import { graphql, printSchema, GraphQLSchema } from "graphql";

export const getGraphQLRoutes = (gQLschema: GraphQLSchema) => {
  const router: Router = new Router();

  router.all(
    "/schema",
    bodyParser(),
    //Auth.isAuthorized("superadmin"),
    //middlewareRoleExists,
    async (ctx) => {
      ctx.body = printSchema(gQLschema);
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
      ctx.body = await graphql(gQLschema, query);
    }
  );

  return router.routes();
};
