import Schema from "@nexys/fetchr/dist/graphql/schema";
import { Connection } from "@nexys/fetchr/dist/database";

import getRouter from "../../../lib/routes/graphql/index";

import model from "../../../common/generated";
import submodels from "../../../common/generated/submodels";
import { Permissions } from "../../../common/generated/type";
import { roleMap } from "../../../common/generated/utils";

import Product from "../../product";
import * as Config from "../../config";

const pool = new Connection.SQL(Config.database, "MySQL");

const schemas = new Schema<Permissions>(model, pool, "MySQL", submodels);

const router = getRouter(
  schemas,
  Config.appToken,
  Product.middlewareAuth,
  roleMap
);

export default router.routes();
