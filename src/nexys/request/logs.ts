import { MutateResponseInsert } from "@nexys/fetchr/dist/type";
import { Uuid } from "@nexys/utils/dist/types";
import * as NexysQueryService from "../nexys-qs";
import { Param } from "../types";

interface RequestLog {
  request: { uuid: Uuid };
  responseBody: string;
  instance: { uuid: Uuid };
  inputs: string;
  logDateAdded: Date;
}

const getPayload = (
  apiRequestUuid: Uuid,
  apiParamsIn: Param[],
  instance: { uuid: Uuid },
  responseBody: string
): RequestLog => {
  const apiParams: { key: string; value: string }[] = apiParamsIn
    .filter((x) => x.paramType?.id === 1 || true)
    .map((x) => ({ key: x.key, value: x.value }));

  const request = {
    uuid: apiRequestUuid,
  };
  const inputs: string = JSON.stringify(apiParams);
  const logDateAdded = new Date();

  return {
    request,
    responseBody,
    instance,
    inputs,
    logDateAdded,
  };
};

export const insert = (
  apiRequestUuid: Uuid,
  apiParamsIn: any[],
  instance: { uuid: Uuid },
  responseBody: any
): Promise<MutateResponseInsert> => {
  // map to required structure
  const payload = getPayload(
    apiRequestUuid,
    apiParamsIn,
    instance,
    responseBody ? JSON.stringify(responseBody) : "could not find response body"
  );

  return NexysQueryService.insert(entity, payload);
};

export const list = (request: { uuid: Uuid }) => {
  const params = {
    projection: { responseBody: true, inputs: true, logDateAdded: true },
    filters: { request },
    order: { by: "logDateAdded", desc: true },
  };
  console.log(params);
  return NexysQueryService.list(entity, params);
};

const entity = "RequestLog";
