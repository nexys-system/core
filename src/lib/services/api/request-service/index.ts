import fetch from "node-fetch";
import * as rfetch from "node-fetch";

import {
  ActionInput,
  Param,
  ActionOutput,
  Request,
  ResponseMapped,
  Response,
} from "../types";

import * as ParamService from "../param";
import * as U from "./utils";
import { Uuid } from "@nexys/utils/dist/types";
import * as LogService from "./logs";
import { Context } from "../../../context/type";

/**
 * find request
 * @params uuid
 */
export const find = (uuid: string, context: Context): Request => {
  const requests: Request[] = context.request;
  console.log(requests.length, uuid, requests);
  const request = requests.find((request) => request.uuid === uuid);

  if (!request) {
    throw Error("The request could not be found");
  }

  return request;
};

/**
 * Executes an API request from request uuid
 * Finds the request to execute from requests provided by config by using uuid
 * @param uuid (str): the uuid of an api request
 * @param input ActionInput
 * @param context
 */
export const findAndExec = async (
  uuid: string,
  input: ActionInput,
  context: Context
): Promise<Response> => {
  const request: Request = find(uuid, context);

  const instance: { uuid: Uuid } = { uuid: context.instance.uuid };

  // NOTE: replace url params & envvar
  const requestWEnvVar: Request = U.prepare(request, input.params, context);

  return execWithMapping(requestWEnvVar, input, instance);
};

/**
 * Execute an api request from request object
 * First maps apiParamsIn using request.mappingIn
 * Then executes the request with mapped apiParams
 * Then maps the API response to apiParamsOut
 * @param request
 * @param apiParamsIn (list)
 **/
export const execWithMapping = async (
  request: Request,
  input: ActionInput,
  instance: { uuid: Uuid }
): Promise<Response> => {
  const paramsIn: Param[] = ParamService.Input.listMerge(
    input,
    request.mappingIn
  );

  const mappedInput: Param[] = ParamService.mapParams(
    request.mappingIn,
    paramsIn,
    true
  );

  // NOTE: execute API request
  const response: ResponseMapped = await execWithParams(request, mappedInput);

  // TODO: review handling headers
  const { body, headers } = ParamService.Output.explodeList(
    response.mappedParamsOut
  );

  try {
    LogService.insert(request.uuid, mappedInput, instance, body);
  } catch (err) {
    console.log(err);
  }

  // TODO: vs HTTP.Success?
  return {
    status: response.status,
    body,
    headers: response.headers || headers,
  };
};

/**
 * executes request with params.
 * @param request
 * @param params: Here params (not to be confuised with url params) are the exhaustive list of inputs (outputs) sent to the API
 * @return output of API mapped onto output params
 */
export const execWithParams = async (
  request: Request,
  params: Param[]
): Promise<ResponseMapped> => {
  const {
    data,
    headers: headersIn,
    query,
  } = ParamService.Input.explodeList(params, request.rawbody);

  const response: Response = await exec(request, data, headersIn, query);

  const { status, body, headers } = response;
  if (status !== 200 && status !== 201) {
    console.log({ status });
    console.log(body);
    throw Error(JSON.stringify({ status, body }));
  }

  const output: ActionOutput = { body, headers };
  const paramsOut = ParamService.Output.listMerge(output, request.mappingOut);
  const mappedParamsOut: Param[] = ParamService.mapParams(
    request.mappingOut,
    paramsOut,
    false
  );

  // vs HTTP.Success?
  return { status, mappedParamsOut, headers, body };
};

/**
 * Explodes mapped apiParams and executes request
 * @param request
 * @param apiParams: these have been mapped and so are ready for the request
 */
export const exec = async (
  request: Request,
  payload: any,
  headers: any,
  query: { [k: string]: string }
): Promise<Response> => {
  const url = U.getFinalUrl(request.host, request.uri, query);
  const method = request.method.name;

  const body: string | undefined =
    payload && payload !== null ? JSON.stringify(payload) : undefined;

  const options: rfetch.RequestInit = {
    method,
    body,
    headers: { "content-type": "application/json", ...headers },
  };

  try {
    const r = await fetch(url, options);
    const { status } = r;
    const text = await r.text();
    const body = U.formatBody(text);

    return { status, body, headers: {} };

    // why so complicated?
    //return await Lib.Request.call(options, true);
  } catch (err) {
    console.log((err as any).toString());
    throw Error(err as any);
  }
};

export const list = (context: Context): Request[] => context.request;
