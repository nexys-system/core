import * as Input from "./input";
import * as Output from "./output";
import * as Type from "./type";

import { Param, MappingUnit, DataType, ParamType } from "../types";

export { Input, Output, Type };

const castValue = (mu: MappingUnit): string | boolean => {
  const { valueDefault, dataType, paramDefault } = mu;
  // NOTE: configure basic authentication
  if (
    paramDefault &&
    paramDefault.name === "Authorization" &&
    valueDefault.startsWith("Basic") &&
    valueDefault.includes(":")
  ) {
    return `Basic ${Buffer.from(valueDefault.split(" ")[1]).toString(
      "base64"
    )}`;
  }

  switch (dataType.id) {
    // Boolean
    case DataType.Boolean:
      return "true" === valueDefault;
    default:
      return valueDefault;
  }
};

export const createMapping = (
  params: MappingUnit[],
  inOrOut: boolean
): MappingUnit[] =>
  params
    .map((param) => {
      const { paramDefault, paramOverride } = param;

      if (!paramDefault && !paramOverride) {
        // ? catch mapping bug where sometimes both input and output are null ?
        return null;
      }

      const overrideFallback = paramOverride || paramDefault;
      const input = inOrOut ? overrideFallback : paramDefault;
      const output = inOrOut ? paramDefault : overrideFallback;

      if (!inOrOut && paramDefault.name.startsWith("$text")) {
        (param as any)["$text"] = true;
      }

      if (!inOrOut && paramDefault.name.startsWith("$array")) {
        (param as any)["$array"] = true;
      }

      param.mapping = {
        input,
        output,
      };

      return param;
    })
    .filter((item) => item !== null) as MappingUnit[]; // here issue with null

/*
 * Maps input to required request parameters and output into the required output
 * @param inOrOut: determines whether mapping external parameters onto request (true) or we are extracting request output parameters
 */

const mapParam = (
  mu: MappingUnit,
  values: Param[]
): { key: string; value: any; paramType: { id: ParamType } } | undefined => {
  const { valueDefault, mapping, isOptional } = mu;
  const { input, output } = mapping;

  // TODO: if undefined: throw error
  const value: Param | undefined = values.find(
    ({ key, paramType }) =>
      key.toLowerCase() === input.name.toLowerCase() &&
      paramType &&
      paramType.id === input.paramType.id
  );

  if (value) {
    return {
      key: output.name,
      paramType: output.paramType,
      value: value.value,
    };
  } else if (valueDefault) {
    // NOTE: set default value
    const defaultValue = castValue(mu);

    return {
      key: output.name,
      paramType: output.paramType,
      value: defaultValue,
    };
  } else if (input.paramType.id === ParamType.body) {
    if (isOptional) {
      return undefined;
    }

    /* handle if return values do not match */

    throw Error(
      `No fitting parameter found for mapping ${input.name} -> ${output.name}`
    );
  }
};

// TODO: mapRootText
/**
 * Map: [{x, y}] -> [{m, n}]
 */
// NOTE: this function is dataType agnostic?
const mapRootArray = (mappings: any[], param: Param): Param[] => {
  let { key, value: data } = param;

  const mappedData = data.map((item: any) => {
    mappings.forEach(({ mapping }) => {
      const { input, output } = mapping;

      if (input.name !== output.name && input.name !== "$array[]") {
        const prop = input.name.substring(9);
        item[output.name] = item[prop];
        delete item[prop];
      }
    });

    return item;
  });

  // Map: [{}] => {}
  const first = mappings.find(
    ({ mapping }) => mapping.input.name === "$array[0]"
  );
  if (first) {
    // TODO: handle nested array and object types
    const params = Type.format(mappedData[0], ParamType.body);
    return params;
  }

  // Map: [] => { x: [] }
  const mapArray = mappings.find(
    ({ mapping }) => mapping.input.name === "$array[]"
  );
  if (mapArray) {
    key = mapArray.mapping.output.name;
    return [{ key, value: mappedData, paramType: { id: ParamType.body } }];
  }

  return [{ key, value: mappedData, ["$array"]: true }];
};

const mapHeaders = (mapping: MappingUnit[], values: any[]): Param[] => {
  // !item['$text'], !item['$array'] => should be taken care of by item.mapping.input.paramType === 2
  const headerMapping = mapping.filter(
    (item) =>
      item.mapping &&
      item.mapping.input &&
      item.mapping.input.paramType.id === ParamType.headers
  );
  const r = headerMapping
    .map((item) => mapParam(item, values))
    .filter(Boolean) as Param[];
  return r;
};

/**
 * Maps the values passed in from request using the mapping defined in the request config
 * @param mapping (list[object]): from request.mappingIn (defined in request JSON from config)
 * @param values (list): this is the flatten and nested list of apiParamsIn recevied in the request
 * @param inOrOut true if input
 * @returns only values defined in mapping on way in and out
 */
export const mapParams = (
  raw: any[] = [],
  values: any[],
  inOrOut: boolean = true
): Param[] => {
  // NOTE: if no mapping defined: keep all values
  if (raw.length === 0) return values;

  // NOTE: it doesn't matter if input or output
  const mapping = createMapping(raw, inOrOut);

  const rootText = values.find((p) => p.key === "$text");
  // NOTE: handle root array => handle paramDefault with root[]
  const rootArray = values.find((p) => p.key === "$array");
  if (rootText) {
    const headerValues = values.filter((p) => p.key !== rootText.key);
    return [rootText].concat(mapHeaders(mapping, headerValues));
  } else if (rootArray) {
    // NOTE: standard mapping for headers
    const headerValues = values.filter((p) => p.key !== rootArray.key);
    const headerParams = mapHeaders(mapping, headerValues);

    if (inOrOut) {
      return [rootArray, ...headerParams]; // NOTE: on way in no mapping is necessary
    } else {
      const arrayMapping = mapping.filter((item) =>
        item.hasOwnProperty("$array")
      );
      // TODO: for input transform array to $root
      if (arrayMapping.length > 0) {
        const rootParam = mapRootArray(arrayMapping, rootArray);
        return rootParam.concat(headerParams);
      } else {
        throw Error("No array mapping found");
      }
    }
  } else {
    // TODO: remove authorization headers here?
    //const schema = createSchema(mapping);

    // NOTE: if payload, validate mapping
    if (inOrOut) {
      //&& !Utils.ds.isEmpty(schema.describe().children)) {
      //const body = Utils.ds.nest(values); // NOTE: schema applies to any paramType => avoid key conflicts // filterByParamType(values, 'body')
      // NOTE: nested objects - https://github.com/hapijs/joi/issues/1397
      // todo fix lifb
      // todo validate!
      //Validation.validateSync(body, schema); //{ abortEarly: false, allowUnknown: true, presence: 'required', format: { prefix: 'params' }}
      /*
        // NOTE: if param required, return error; if argument is optional, no action necessary
        if (!isOptional) {
          const errorParamType = getParamTypeString(input.paramType);
          errors[input.name] = 'This field is required' + errorParamType;
          // TODO: https://github.com/koajs/locales
        }
      */
    }

    const result: any[] = [];
    for (const item of mapping) {
      const mapped = mapParam(item, values);
      if (mapped) {
        result.push(mapped);
      }
    }
    return result;
  }
};
