import Koa from "koa";
import Joi from "@hapi/joi";
import _bodyParser from "koa-body";

import * as Validation from "../validation";

import Auth from "./auth";
import { readToken } from "./auth";

const authHelpers = { readToken };

export { authHelpers, Auth };

export const handleResponse = async (
  r: () => Promise<any> | any,
  ctx: Koa.Context,
  errorOverride?: string
) => {
  try {
    ctx.body = await r();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.error || { message: err.message };
    const e = errorOverride ? Error(errorOverride) : err;
    ctx.app.emit("error", e, ctx);
  }
};

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

export const validate = <A>(schema: Joi.ObjectSchema<A>) => async (
  ctx: Koa.Context,
  next: Koa.Next
) => {
  checkHeaders(ctx.request.headers);

  try {
    const c: A = await Validation.validate(ctx.request.body, schema);
    ctx.state.validationResult = c;
    await next();
  } catch (err) {
    ctx.status = err.status;
    ctx.body = err.body;
    return;
  }
};
