import Router from "koa-router";

import * as GraphQLService from "../../lib/graph-ql";

import * as Product from "../product";

import * as GraphQl from "../graph-ql";
import * as Config from "../config";

const gQLSchema = GraphQLService.SchemaFactory.getSchemaFromJSONDDL(
  Config.model,
  Product.qs
);

const router = new Router();

router.use("/", GraphQl.getGraphQLRoutes(gQLSchema, Config.appToken));

export default router.routes();
