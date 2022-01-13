import Schema from "../../../lib/graph-ql/schema";
import getRouter from "../../../lib/routes/graphql/index";

import Product, { fetchR } from "../../product";
import * as Config from "../../config";

import model from "../../../common/generated";
import submodels from "../../../common/generated/submodels";
import { Permissions } from "../../../common/generated/type";
import { roleMap } from "../../../common/generated/utils";

const schemas = new Schema<Permissions>(model, fetchR, submodels);

const router = getRouter(
  schemas,
  Config.appToken,
  Product.middlewareAuth,
  roleMap
);
export default router.routes();
