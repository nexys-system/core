import * as FetchR from "@nexys/fetchr";

import ProductService from "../lib/product";
import QueryService from "../lib/query/service";
import Cache from "../lib/cache/local";

import * as Config from "./config";

import WorkflowService from "../lib/services/workflow2";
import EmailService from "../lib/services/email";
import NotificationService from "../lib/services/notification";

export const email = new EmailService(Config.host, Config.appToken);
export const workflow = new WorkflowService(Config.host, Config.appToken);
export const notifications = new NotificationService(
  Config.host,
  Config.appToken
);

const fetchR = new FetchR.default(Config.database, Config.model);
export const qs = new QueryService(fetchR);
export const cache = new Cache();

const p = new ProductService(
  { host: Config.host, appToken: Config.appToken, secretKey: Config.secretKey },
  qs,
  cache
);

//const s = new Subscription(Config.host, Config.appToken);
//s.subscribe().then((x) => console.log(x));

export default p;
