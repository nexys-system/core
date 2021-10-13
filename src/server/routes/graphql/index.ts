import Schema from "../../../lib/graph-ql/schema";
import getRouter from "../../../lib/routes/graphql/index";

import Product from "../../product";
import * as Config from "../../config";

const schemas = new Schema(Config.model, Product.qs);

const router = getRouter(schemas, Config.appToken, Product.middlewareAuth);
export default router.routes();
