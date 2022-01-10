import { Uuid } from "@nexys/utils/dist/types";

export enum DataType {
  String = 1,
  Number = 2,
  Decimal = 3,
  Boolean = 4,
  Array = 5,
  Object = 6,
}

export enum ParamType {
  body = 1, // payload - body
  headers = 2, // header
  params = 3, // query string
}

export enum Method {
  GET = 1,
  POST = 2,
  PUT = 3,
  PATCH = 4,
  DELETE = 5,
}

export interface ActionInput {
  data: any;
  params?: any;
  headers?: any;
  query?: any;
}

export interface ActionOutput {
  body: any | string;
  headers?: any;
  query?: any;
}

export interface Param {
  key: string;
  value: string | any[] | any;
  paramType?: { id: ParamType };
  $array?: boolean;
}

export type Headers = { [k: string]: string };

export interface Response<A> {
  body: A;
  headers: Headers;
  status: number;
}

export interface UnitMapping {
  mappingIn: RequestMapping[];
  mappingOut: RequestMapping[];
}

export interface Request extends UnitMapping {
  uuid: Uuid;
  host: string;
  label: string;
  uri: string;
  method: { id: Method; name: string };

  rawbody?: string;
}

export interface ResponseMapped {
  status: number;
  mappedParamsOut: Param[];
  headers: Headers;
  body: any;
}

export interface RequestMappingParam {
  name: string;
  paramType: { id: ParamType };
}

export interface RequestMapping {
  inOrOut: boolean;
  paramDefault?: RequestMappingParam;
  paramOverride?: RequestMappingParam;
  dataType: { id: DataType };
  isOptional: boolean;
  valueDefault?: string | number;
}

export interface MappingUnit {
  mapping: Mapping;
  paramDefault: { name: string };
  paramOverride: any;
  dataType: { id: DataType };
  isOptional: boolean;
  valueDefault: string;
}

export interface Env {
  key: string;
  value: string;
}

export interface Mapping {
  input: RequestMappingParam;
  output: RequestMappingParam;
}

//export interface Snippet extends UnitMapping {
//  uuid: Uuid;
//}

export type Snippet = any;
