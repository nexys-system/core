import Koa from "koa";
import _bodyParser from "koa-body";

import * as Validation from "./validate";

import Auth from "./auth";
import { readToken } from "./auth";

const authHelpers = { readToken };

export { authHelpers, Auth };

export const defaultMessage = "an error occurred, see logs for more details";
export const defaultStatus = 500;

export const handleError = (err: any, messageOverride?: string) => {
  const status: number = err.status || defaultStatus;
  const expose: boolean = err.expose || false;
  const error = err.body || { message: err.message || defaultMessage };

  // if the error is not exposed display in the logs
  if (!expose) {
    console.error(JSON.stringify(error, null, 2));
  }

  const message = messageOverride || defaultMessage;
  const body = expose ? error : { message };

  return { status, body };
};

export const handleResponse = async <A = any>(
  r: () => Promise<A> | A,
  ctx: Koa.Context,
  messageOverride?: string
) => {
  try {
    ctx.body = await r();
  } catch (err) {
    const { status, body } = handleError(err, messageOverride);
    ctx.status = status;
    ctx.body = body;
    //const e = errorOverride ? Error(errorOverride) : err;
    //https://github.com/koajs/koa/issues/1162
    //ctx.app.emit('error', e);
  }
};

export const validate = Validation.body;
