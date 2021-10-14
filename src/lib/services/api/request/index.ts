import { Context } from "../../../context/type";

import * as RequestService from "../request-service";
import * as RequestLogService from "../request-service/logs";

type Uuid = string;

export default class RequestService2 {
  context: Pick<Context, "instance" | "env" | "request" | "appToken">;
  constructor(
    context: Pick<Context, "instance" | "env" | "request" | "appToken">
  ) {
    this.context = context;
  }

  exec = (
    uuid: Uuid,
    {
      data,
      params,
    }: // headers,
    {
      data?: any;
      params?: { [key: string]: string };
      // headers?: { [key: string]: string };
    } = {}
  ) => {
    const actionInput = {
      data,
      params,
      headers: undefined, // todo
      query: undefined, // todo
    };
    RequestService.findAndExec(uuid, actionInput, this.context);
  };

  logs = (
    uuid: Uuid
  ): Promise<
    { uuid: Uuid; responseBody: string; inputs: string; logDateAdded: Date }[]
  > => RequestLogService.list({ uuid }, this.context);
}
