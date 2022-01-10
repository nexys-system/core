import WS from "@nexys/workflow";

import * as NexysService from "../nexys-service";
import * as RequestService from "@nexys/api-request/dist/request-service/index";
import RequestLogService from "@nexys/api-request/dist/request-service/logs/nexys-service";
import { Context } from "../../context/type";

export default class Workflow extends WS {
  constructor(context: Context) {
    const logService = new RequestLogService(NexysService.request);
    const r = <A>(uuid: string, input: any, context: any) =>
      RequestService.findAndExec<A>(uuid, input, context, logService);
    super(context, NexysService.request, r);
  }
}
