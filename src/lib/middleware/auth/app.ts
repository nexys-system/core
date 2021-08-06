/**
 * manages acces for app
 * token is communicated as auhtorization bearer token
 */
import Koa from "koa";

import JWT from "../../jwt";
import Cache from "../../cache/cache";

import * as U from "./utils";
// see https://github.com/Nexysweb/koa-lib/blob/master/src/middleware/index.ts

export default class Auth {
  cache: Cache;
  jwt: JWT;
  appToken: string;

  /**
   *
   * @param cache needed for extra login information
   * @param secret for the JWT verification
   */
  constructor(appToken: string, cache: Cache, secret: string) {
    this.appToken = appToken;
    this.cache = cache;
    this.jwt = new JWT(secret);
  }

  isAuthenticated =
    () =>
    async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
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
