import * as T from "./type";
import * as TT from "../../lib/services/api/types";

const mappingsToOut = (x: T.ParamMapping): TT.RequestMapping => {
  const paramDefault = x.output;
  // remove unused value default
  delete (paramDefault as any)["valueDefault"];

  return {
    isOptional: x.isOptional,
    dataType: x.dataType,
    inOrOut: x.inOrOut,
    paramDefault: x.output,
    paramOverride: x.input,
    valueDefault: x.valueDefault,
  };
};

const getMappings = (
  ParamMapping?: T.ParamMapping[]
): { mappingIn: TT.RequestMapping[]; mappingOut: TT.RequestMapping[] } => {
  if (!ParamMapping) {
    return {
      mappingIn: [],
      mappingOut: [],
    };
  }
  // TODO: inOrOut true/false
  const mappingIn = ParamMapping.filter(({ inOrOut }) => inOrOut === true).map(
    mappingsToOut
  );

  const mappingOut = ParamMapping.filter(
    ({ inOrOut }) => inOrOut === false
  ).map(mappingsToOut);

  return {
    mappingIn,
    mappingOut,
  };
};

/**
 * Map the API request format
 * @param body
 *
 **/
export const format = ({
  uuid,
  host,
  url: uri,
  method,
  label,
  ParamMapping,
  rawbody,
}: T.ApiRequest): TT.Request => {
  const { mappingIn, mappingOut } = getMappings(ParamMapping);

  return {
    uuid,
    host,
    uri,
    method,
    mappingIn,
    mappingOut,
    label,
    rawbody,
  };
};
