import { MutateResponseInsert } from "@nexys/fetchr/dist/type";
import { Uuid } from "@nexys/utils/dist/types";
import { Context } from "../../../context/type";
import { request } from "../../nexys-service";

export const insert = (
  apiRequestUuid: Uuid,
  apiParamsIn: any[],
  instance: { uuid: Uuid },
  responseBody: any,
  context: Context
): Promise<MutateResponseInsert> =>
  request<{
    apiRequestUuid: Uuid;
    apiParamsIn: any[];
    instance: { uuid: Uuid };
    responseBody: any;
  }>(
    "/request/log/insert",
    {
      apiRequestUuid,
      apiParamsIn,
      instance,
      responseBody,
    },
    context.appToken
  );

export const list = (mrequest: { uuid: Uuid }, context: Context) =>
  request<{ request: { uuid: Uuid } }>(
    "/request/log/list",
    { request: mrequest },
    context.appToken
  );
