/**
 * manages acces for app
 * token is communicated as auhtorization bearer token
 */
import Koa from "koa";

import * as U from "./utils";
// see https://github.com/Nexysweb/koa-lib/blob/master/src/middleware/index.ts

class Auth {
  appToken: string;

  /**
   *
   * @param appToken: APP_TOKEN: no client authentication
   */
  constructor(appToken: string) {
    this.appToken = appToken;
  }

  isAuthenticated = async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
    const { headers } = ctx;

    const token = U.extractOptBearerToken(headers.authorization);

    const r = U.mapTokenWithResponse(this.appToken, token);

    if (r) {
      const { message, status } = r;

      ctx.status = status;
      ctx.body = { message };
      return;
    }

    await next();
  };
}

export default Auth;
