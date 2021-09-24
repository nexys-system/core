import { Uuid } from "@nexys/utils/dist/types";
import * as TT from "../../lib/services/api/types";

export interface ParamMapping {
  output: TT.RequestMappingParam;
  input: TT.RequestMappingParam;
  dataType: { id: number };
  inOrOut: boolean;
  isOptional: boolean;
  valueDefault?: string;
}

export interface ApiRequest {
  uuid: Uuid;
  host: string;
  url: string;
  method: { id: number; name: string };
  label: string;
  description?: string;
  ParamMapping?: ParamMapping[];
  rawbody?: string;
}
