import * as Type from "./type";
import { ActionInput, Param, ParamType, RequestMapping } from "../types";
import Utils from "@nexys/utils";

/**
 * takes all request input and consolidates them all into Seq[ApiParam] (via linearization)
 * @param payload: jsobject containing the payload
 * @param headers: input request headers
 * @param queryString: input request query String
 * @return list of ApiParams
 **/
export const listMerge = (
  input: ActionInput,
  mappingIn?: Omit<RequestMapping, "inOrOut" | "isOptional">[]
): Param[] => {
  const { data, query } = input; // headers is not used for now

  const listPayload = Type.format(data, ParamType.body, mappingIn);
  const listHeaders = Type.format({}, ParamType.headers, mappingIn); // IMPORTANT: headers cannot be overwritten!
  const listQuery = Type.format(query, ParamType.params);

  return [...listPayload, ...listHeaders, ...listQuery];
};

export const getPayload = (pBody: Param[], rawBody?: string): any => {
  if (rawBody) {
    return prepareBody(rawBody, pBody);
  }

  const rootArray = pBody.find((p) => p.key === "$array");
  if (rootArray) {
    return rootArray.value;
  }
  return Utils.ds.nest(pBody);
};

/**
 * explodes apiParamsIn back into nested components
 * @param arr (Array[Object]): linearized and consolidated apiParamsIn
 * @returns {{payload: *, headers: *, queryString: *}}
 **/
export const explodeList = (arr: Param[], rawBody?: string): ActionInput => {
  // console.log(arr);
  const pBody = Type.filterByName(arr, ParamType.body);
  // TODO: remove unwanted headers
  const headers = Utils.ds.nest(Type.filterByName(arr, ParamType.headers));
  const query = Utils.ds.nest(Type.filterByName(arr, ParamType.params));

  const data = getPayload(pBody, rawBody);

  return { data, headers, query };
};

// add params in body
export const prepareBody = (rawBody: string, params: Param[]) => {
  params.forEach((p) => {
    const newValue = JSON.stringify(p.value).slice(1, -1); // stringify to rtake care of special chars, and remove start and end "
    rawBody = rawBody.replace(`{{${p.key}}}`, newValue);
  });

  return JSON.parse(rawBody);
};
