import Schema from "@nexys/fetchr/dist/graphql/schema";
import getRouter from "../../../lib/routes/graphql/index";

import Product from "../../product";
import * as Config from "../../config";

import model from "../../../common/generated";
import submodels from "../../../common/generated/submodels";
import { Permissions } from "../../../common/generated/type";
import { roleMap } from "../../../common/generated/utils";
import { Connection } from "@nexys/fetchr/dist/database";

const pool = new Connection.SQL(Config.database);

const schemas = new Schema<Permissions>(model, pool, submodels);

const router = getRouter(
  schemas,
  Config.appToken,
  Product.middlewareAuth,
  roleMap
);
export default router.routes();
