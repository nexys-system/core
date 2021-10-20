import * as FetchR from "@nexys/fetchr";

import ProductService from "../lib/product";
import QueryService from "../lib/query/service";
import Cache from "../lib/cache/local";

import * as Config from "./config";

import WorkflowService from "../lib/services/workflow";
import EmailService from "../lib/services/email";
import NotificationService from "../lib/services/notification";

export const email = new EmailService(Config.context);
export const workflow = new WorkflowService(Config.context);
export const notifications = new NotificationService(Config.context);

const fetchR = new FetchR.default(Config.database, Config.model);
export const qs = new QueryService(fetchR);
export const cache = new Cache();

const p = new ProductService(
  { appToken: Config.appToken, secretKey: Config.secretKey },
  qs,
  cache
);

export default p;
