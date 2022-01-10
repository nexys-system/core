import WS from "@nexys/workflow";

import * as NexysService from "../nexys-service";
import * as RequestService from "../api/request-service";
import { Context } from "../../context/type";

export default class Workflow extends WS {
  constructor(context: Context) {
    super(context, NexysService.request, RequestService.findAndExec);
  }
}
