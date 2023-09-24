import FetchR, { QueryService } from "@nexys/fetchr";
import Cache from "@nexys/node-cache";

import * as Config from "./config";

import WorkflowService from "../lib/services/workflow";
import EmailService from "../lib/services/email";
import NotificationService from "../lib/services/notification";

import model from "../common/generated";

export const email = new EmailService(Config.context);
export const workflow = new WorkflowService(Config.context);
export const notifications = new NotificationService(Config.context);

export const fetchR = new FetchR(Config.database, "MySQL", model);
export const qs = new QueryService.Service(fetchR);
export const cache = new Cache();
