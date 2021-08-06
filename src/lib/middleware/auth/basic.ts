/**
 * manages access for basic authentication
 */
import Koa from "koa";
import * as U from "./utils";

// basic auth
export const isBasicAuthenticated =
  (username: string, password: string) =>
  async (ctx: Koa.Context, next: Koa.Next) => {
    const Authorization = ctx.headers["Authorization"];
    const token = U.extractBasicAuthToken(Authorization as string);

    if (token === U.createBasicAuthToken(username, password)) {
      await next();
    } else {
      ctx.status = 401;
      ctx.body = { msg: "unauthorized" };
    }
  };
