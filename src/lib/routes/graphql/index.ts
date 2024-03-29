import Router from "@koa/router";
import bodyParser from "koa-body";
import { graphql, printSchema } from "graphql";

//import MiddlewareAuth,
//import * as Auth from "../../middleware/auth";

import Schema from "@nexys/fetchr/dist/graphql/schema";

import * as ErrorHandler from "./error-handler";
// todo restore permission
//import { Permissions } from "../../../common/generated/type";

// cannot use reference from above else the package will not be built correctly (includes the lib folder)
//const superadminPermission = 3;

const getRouter = <Permission>(
  schemas: Schema<Permission>,
  roleMap: Map<string, Permission>
) => {
  const router = new Router();

  ///const appAuth = new Auth.App.default(appToken);

  // access for app (using app token)

  // this is the default schema, superadmin. Accessible via app token
  router.all("/schema", bodyParser(), async (ctx) => {
    ctx.body = printSchema(schemas.gQLSchema);
  });

  router.post("/query", bodyParser(), async (ctx) => {
    const { body } = ctx.request;
    const { query } = body;
    ctx.body = await graphql({ schema: schemas.gQLSchema, source: query });
  });

  // raw model is exported here, needed for the entity browser
  router.all("/model", (ctx) => {
    ctx.body = schemas.rawModel;
  });

  router.all(
    "/superadmin/model",
    //  middlewareAuth.isAuthenticated(),
    //  middlewareAuth.hasPermission(superadminPermission),
    (ctx) => {
      ctx.body = schemas.rawModel;
    }
  );

  // end default

  // end: access for app (using app token)

  // access for client with specific role
  router.all(
    "/:role/schema",
    bodyParser(),
    //   middlewareAuth.isAuthenticated(),
    async (ctx) => {
      try {
        const schema = schemas.getSchemaFromCtx(ctx, roleMap);
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
    //   middlewareAuth.isAuthenticated(),
    async (ctx) => {
      try {
        const schema = schemas.getSchemaFromCtx(ctx, roleMap);
        const { body } = ctx.request;
        const { query } = body;

        ctx.body = await graphql({ schema, source: query });
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
