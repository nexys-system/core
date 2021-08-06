/**
 * manages acces for app
 * token is communicated as auhtorization bearer token
 */
import Koa from "koa";

import * as U from "./utils";
// see https://github.com/Nexysweb/koa-lib/blob/master/src/middleware/index.ts

export default class Auth {
  appToken: string;

  /**
   *
   * @param cache needed for extra login information
   * @param secret for the JWT verification
   */
  constructor(appToken: string) {
    this.appToken = appToken;
  }

  isAuthenticated = async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
    const { headers } = ctx;

    const token = U.extractOptBearerToken(headers.authorization);

    if (token === undefined) {
      ctx.status = 401;
      ctx.body = { message: "please provide a token" };
      return;
    }

    if (token !== this.appToken) {
      ctx.status = 401;
      ctx.body = { message: "the token provided is wrong" };
      return;
    }

    await next();
  };
}
