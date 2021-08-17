import * as FetchR from "@nexys/fetchr";

import ProductService from "../lib/product";
import QueryService from "../lib/query/service";
import Cache from "../lib/cache/local";

import * as Config from "./config";

const fetchR = new FetchR.default(Config.database, Config.model);
export const qs = new QueryService(fetchR);
export const cache = new Cache();

const p = new ProductService(
  { host: Config.host, appToken: Config.appToken, secretKey: Config.secretKey },
  qs,
  cache
);

export default p;
