import Utils from "@nexys/utils";
import { DataType, Param, ParamType, RequestMapping } from "../types";
import * as U from "./utils";

export const addByName = <A>(
  x: A,
  name: ParamType
): A & { paramType: { id: ParamType; name: string } } => ({
  ...x,
  paramType: { id: name, name: ParamType[name] },
});

export const filterByName = (arr: Param[], paramType: ParamType): Param[] =>
  arr.filter((item) => item.paramType && item.paramType.id === paramType);

/**
 * Also handled data types of arrays and objects: if an input is defined as an array or a datatype then we don't linearize it.
 * @param data
 * @param mappingIn: defines the inputs expected in the json and the data types
 * @returns Array[Object]
 */
export const format = (
  data: string | any[] | any,
  paramType: ParamType,
  mappingIn?: Omit<RequestMapping, "inOrOut" | "isOptional">[]
): ({ key: "$text" | "$array"; value: any } | Param)[] => {
  // NOTE: handle text/(html|plain)
  if (typeof data === "string") {
    return [{ key: "$text", value: data }];
  }

  // NOTE: handle root array
  if (Array.isArray(data)) {
    return [{ key: "$array", value: data }];
  }

  // NOTE: add missing default values
  if (mappingIn) {
    // && addDefault => addDefault true
    // filter?
    mappingIn.forEach(({ paramOverride, paramDefault, valueDefault }) => {
      if (!paramDefault) {
        throw Error("param default is undefined");
      }
      const key: string = paramOverride
        ? paramOverride.name
        : paramDefault.name;

      if (!(key in data)) {
        const value = valueDefault;
        //console.log({ key, paramTypeUnit, value });
        //(paramOverride && paramOverride.valueDefault) ||
        //paramDefault.valueDefault ||
        //valueDefault;
        if (value) {
          data[key] = value;
        }
      }
    });
  }

  // NOTE: handle empty response
  if (Utils.ds.isEmpty(data)) {
    return [];
  }

  // NOTE: return objects & arrays without flattening their values
  const nonPrimitives: { key: string; value: any }[] = [];
  if (mappingIn) {
    mappingIn
      .filter(
        ({ dataType }) =>
          dataType.id === DataType.Object || dataType.id === DataType.Array
      )
      .forEach(({ paramOverride, paramDefault }) => {
        if (!paramDefault) {
          throw Error("param default is undefined");
        }
        const key: string = paramOverride
          ? paramOverride.name
          : paramDefault.name;

        const value = data[key];
        if (value) {
          nonPrimitives.push({ key, value });
          data = Utils.ds.removeProp(data, key);
        }
      });
  }

  // NOTE: flattens all entries into key, value
  let result = U.linearize(data);
  if (nonPrimitives && nonPrimitives.length > 0) {
    result = [...result, ...nonPrimitives];
  }

  return result.map((item) => addByName(item, paramType));
};
