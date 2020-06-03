import Joi from "@hapi/joi";
import HTTP from "@nexys/http";
import * as Type from "./type";

// make types available
export { Type };

//https://codeburst.io/five-tips-i-wish-i-knew-when-i-started-with-typescript-c9e8609029db
//type Option<T> = T | undefined

export const getMessage = (err: { message: string; type: string }): string => {
  if (err.type === "object.missing") {
    return err.message.replace(/\"/g, "");
  }

  return err.type;
};

/**
 *
 * format JOI into Play-like errors
 */
export const formatErrors = (errArr: Type.Error[] = [], prefix?: string) =>
  errArr.reduce((errors: any, err) => {
    const path = err.path.length === 0 ? "object" : err.path.join(".");
    const prop = prefix ? prefix + "." + path : path;

    const message = getMessage(err);

    if (path in errors) errors[prop] = [...errors[path], message];
    else errors[prop] = [message];

    return errors;
  }, {});

export const ensureSchema = (schema: any) => {
  if (Joi.isSchema(schema)) {
    return schema;
  }

  // NOTE: schema coercion
  return Joi.compile(schema);
};

export const validate = async <A = any>(
  body: A,
  schema: any,
  options: Type.Options = {}
): Promise<A | { error: any }> => {
  const {
    abortEarly = false,
    allowUnknown = true,
    presence = undefined,
    format = undefined,
  } = options;

  try {
    return await ensureSchema(schema).validateAsync(body, {
      presence,
      abortEarly, // NOTE: do not stop at first error, return all errors
      allowUnknown,
    });
  } catch (err) {
    const validErrors = formatErrors(
      err.details,
      format ? format.prefix : undefined
    );
    throw new HTTP.Error(validErrors); // client error: bad request
  }
};
