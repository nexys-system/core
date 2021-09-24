import * as Type from "./type";

import Utils from "@nexys/utils";

import { ActionOutput, ParamType } from "../types";

/**
 * takes all request input and consolidates them all into Seq[ApiParam] (via linearization)
 * @param payload: jsobject containing the payload
 * @param headers: input request headers
 * @param queryString: input request query String
 * @return list of ApiParams
 */
export const listMerge = (output: ActionOutput, mappingOut?: any[]) => {
  const { body, headers } = output;

  const listPayload = Type.format(body, ParamType.body, mappingOut);
  const listHeaders = Type.format(headers, ParamType.headers);

  return [...listPayload, ...listHeaders];
};

/**
 * Takes outgoing params and turn them into body & headers
 */
export const explodeList = (paramsOut: any[] | any): ActionOutput => {
  if (!Array.isArray(paramsOut)) {
    // return paramsOut;
    throw Error("param out is not an array" + paramsOut);
  }

  const headers: { [k: string]: string } = Utils.ds.nest(
    Type.filterByName(paramsOut, ParamType.headers)
  );

  const rootText = paramsOut.find((p) => p.key === "$text");
  if (rootText) {
    return { body: rootText.value, headers };
  }

  // NOTE: handle root array
  const rootArray = paramsOut.find((p) => p.key === "$array");
  if (rootArray) {
    return { body: rootArray.value, headers };
  }

  const body = Utils.ds.nest(Type.filterByName(paramsOut, ParamType.body));

  return { body, headers };
};
