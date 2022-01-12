import Router from "koa-router";
import bodyParser from "koa-body";
import { graphql, printSchema } from "graphql";

import MiddlewareAuth, * as Auth from "../../middleware/auth";

import Schema from "../../graph-ql/schema";

import * as ErrorHandler from "./error-handler";

const getRouter = (
  schemas: Schema,
  appToken: string,
  middlewareAuth: MiddlewareAuth<any, any, any>
) => {
  const router = new Router();

  const auth = new Auth.App.default(appToken);

  // access for app (using app token)

  // this is the defutschema, superadmin
  router.all("/schema", bodyParser(), async (ctx) => {
    ctx.body = printSchema(schemas.gQLSchema);
  });

  router.post("/", bodyParser(), async (ctx) => {
    const { body } = ctx.request;
    const { query } = body;
    ctx.body = await graphql(schemas.gQLSchema, query);
  });

  router.post("/2", bodyParser(), auth.isAuthenticated, async (ctx) => {
    const { body } = ctx.request;
    const { query } = body;
    ctx.body = await graphql(schemas.gQLSchema, query);
  });
  // end default

  // end: access for app (using app token)

  // access for client with specific role
  router.all(
    "/:role/schema",
    bodyParser(),
    middlewareAuth.isAuthenticated(),
    async (ctx) => {
      try {
        const schema = schemas.getSchemaFromCtx(ctx);
        ctx.body = printSchema(schema);
      } catch (err) {
        ErrorHandler.handleError(ctx, err as ErrorHandler.ErrorWCode);

        return;
      }
    }
  );

  router.post(
    "/:role",
    bodyParser(),
    middlewareAuth.isAuthenticated(),
    async (ctx) => {
      try {
        const schema = schemas.getSchemaFromCtx(ctx);
        const { body } = ctx.request;
        const { query } = body;

        ctx.body = await graphql(schema, query);
      } catch (err) {
        ErrorHandler.handleError(ctx, err as ErrorHandler.ErrorWCode);
        return;
      }
    }
  );
  // end: access for client with specific role

  return router;
};

export default getRouter;
