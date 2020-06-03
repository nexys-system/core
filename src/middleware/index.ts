import Koa from "koa";
import _bodyParser from "koa-body";

import * as Validation from "./validate";

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

export const validate = Validation.body;
