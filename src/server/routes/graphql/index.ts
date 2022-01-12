import Schema from "../../../lib/graph-ql/schema";
import getRouter from "../../../lib/routes/graphql/index";

import Product, { fetchR } from "../../product";
import * as Config from "../../config";

const schemas = new Schema(Config.model, fetchR);

const router = getRouter(schemas, Config.appToken, Product.middlewareAuth);
export default router.routes();
