import Koa from "koa";
import Joi from "@hapi/joi";
import _bodyParser from "koa-body";

import * as Validation from "../../validation";

export const checkHeaders = (headers: { [k: string]: string }): boolean => {
  const k = "content-type";
  const v = "application/json";
  if (!headers || !headers[k] || !(headers[k] === v)) {
    console.warn(
      `Headers are not properly set, errors can occur. Don't forget  "${k}:${v}"`
    );
    return false;
  }

  return true;
};

export const body = <A>(
  schema: Joi.ObjectSchema<A>,
  validationOptions?: Validation.Type.Options
) => async (ctx: Koa.Context, next: Koa.Next) => {
  checkHeaders(ctx.request.headers);

  try {
    const c: A = await Validation.validate(
      ctx.request.body,
      schema,
      validationOptions
    );
    ctx.state.validationResult = c;
    await next();
  } catch (err) {
    ctx.status = err.status;
    ctx.body = err.body;
    return;
  }
};

export const params = <A>(schema: Joi.ObjectSchema<A>, options = {}) => async (
  ctx: Koa.Context,
  next: Koa.Next
) => {
  const { params } = ctx;

  // TODO: type coercion util
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const param = params[key];
      if (!isNaN(param)) {
        params[key] = Number(param);
      }
    }
  }

  await Validation.validate(params, schema, {
    presence: "required",
    format: { prefix: "params" },
    ...options,
  });

  await next();
};
