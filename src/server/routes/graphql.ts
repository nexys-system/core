import Router from "koa-router";
import bodyParser from "koa-body";
import { graphql, printSchema, GraphQLSchema } from "graphql";

import * as GraphQLService from "../../lib/graph-ql";
import * as GraphQLSubmodelService from "../../lib/graph-ql/submodel";

import Product from "../product";

import * as GraphQl from "../graph-ql";
import * as Config from "../config";

const gQLSchema = GraphQLService.SchemaFactory.getSchemaFromModel(
  Config.model,
  Product.qs
);

// submodel

const router = new Router();

router.use(GraphQl.getGraphQLRoutes(gQLSchema, Config.appToken));

const appConstraints = GraphQLSubmodelService.createAppConstraint(Config.model);

const gQLAppSchema = (ids: { Instance: string; User: string }) =>
  GraphQLService.SchemaFactory.getSchemaFromModel(
    Config.model,
    Product.qs,
    appConstraints(ids)
  );

router.all("/app/schema", bodyParser(), async (ctx) => {
  const { profile } = ctx.state;

  const userId = profile.uuid;
  const instanceId = profile.instance.uuid;

  const schema = gQLAppSchema({ User: userId, Instance: instanceId });

  ctx.body = printSchema(schema);
});

router.post(
  "/app",
  bodyParser(),
  Product.middlewareAuth.isAuthenticated(),
  async (ctx) => {
    const { body } = ctx.request;
    const { query } = body;

    const { profile } = ctx.state;
    const userId = profile.uuid;
    const instanceId = profile.instance.uuid;

    const schema = gQLAppSchema({ User: userId, Instance: instanceId });

    ctx.body = await graphql(schema, query);
  }
);

export default router.routes();
