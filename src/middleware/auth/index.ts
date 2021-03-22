import Koa from "koa";
import Compose from "koa-compose";

import { Id, OptionSet } from "@nexys/utils/dist/types";

import JWT from "../../jwt";
import * as T from "../../type";
import * as LT from "./type";
import Cache from "../../cache/cache";
import * as Cookies from "../cookies";

import * as U from "./utils";
// see https://github.com/Nexysweb/koa-lib/blob/master/src/middleware/index.ts

export default class Auth<
  Profile extends T.ObjectWithId,
  UserCache extends LT.Permissions
> {
  cache: Cache;
  jwt: JWT;
  acceptHeaderToken: boolean;

  /**
   *
   * @param cache needed for extra login information
   * @param secret for the JWT verification
   */
  constructor(
    cache: Cache,
    secret: string,
    acceptHeaderToken: boolean = false
  ) {
    this.cache = cache;
    this.jwt = new JWT(secret);
    this.acceptHeaderToken = acceptHeaderToken;
  }

  getProfile = (token: string): Profile => this.jwt.verify<Profile>(token);

  getCache = <A>(id: T.Id): A => this.cache.get(U.getKey(id));

  setCache = (profile: Profile, cacheData: UserCache): string => {
    this.cache.set(U.cacheUserPrefix + profile.id, cacheData);
    return this.jwt.sign(profile);
  };

  authFormat = (
    userCache: UserCache,
    profile: Profile,
    locale: OptionSet = { id: 1, name: "en" }
  ): LT.LoginResponse<Profile> => {
    const token: string = this.setCache(profile, userCache);

    return { permissions: userCache.permissions, token, profile, locale };
  };

  authOutput = (
    ctx: Koa.Context,
    profile: Profile,
    userCache: UserCache,
    locale: OptionSet = { id: 1, name: "en" },
    cookieOpts: {
      secure: boolean;
      sameSite?: boolean | "strict" | "lax" | "none";
    } = { secure: true }
  ) => {
    const r = this.authFormat(userCache, profile, locale);

    return U.login(r, ctx, cookieOpts);
  };

  isAuthenticated = () => async (
    ctx: Koa.Context,
    next: Koa.Next
  ): Promise<void> => {
    const token: string | undefined =
      Cookies.getToken(ctx.cookies) ||
      (this.acceptHeaderToken
        ? U.extractOptBearerToken(ctx.headers["Authorization"])
        : undefined);

    if (token === undefined) {
      ctx.status = 401;
      ctx.body = { message: "please provide a token" };
      return;
    }

    try {
      const profile: Profile = this.getProfile(token);
      const userCache: UserCache = this.getCache<UserCache>(profile.id);
      const state: LT.UserState<Profile, UserCache> = {
        profile,
        userCache,
      };

      ctx.state = state;
    } catch (_err) {
      ctx.status = 401;
      ctx.body = { message: "user could not be authenticated" };
      return;
    }
    await next();
  };

  hasPermission = (permission: string) => async (
    ctx: Koa.Context,
    next: Koa.Next
  ): Promise<void> => {
    const { userCache }: { userCache: UserCache } = ctx.state as any;
    const { permissions } = userCache;

    if (U.isPermissionValid(permission, permissions)) {
      await next();
    } else {
      ctx.status = 401;
      ctx.body = {
        message:
          'user could not be authorized - permission "' +
          permission +
          '" not found',
      };
      return;
    }
  };

  isAuthorized = (
    permission: string
  ): Compose.Middleware<
    Koa.ParameterizedContext<Koa.DefaultState, Koa.Context>
  > => Compose([this.isAuthenticated(), this.hasPermission(permission)]);

  /**
   * removes cookies and cache associated with user
   * @param profile
   * @param ctx
   */
  logout = (profile: Profile, ctx: Koa.Context) => {
    Cookies.removeToken(ctx.cookies);
    this.cache.destroy(U.getKey(profile.id));
  };
}

// basic auth
export const isBasicAuthenticated = (
  username: string,
  password: string
) => async (ctx: Koa.Context, next: Koa.Next) => {
  const Authorization = ctx.headers;
  const token = U.extractBasicAuthToken(Authorization);

  if (token === U.createBasicAuthToken(username, password)) {
    await next();
  } else {
    ctx.status = 401;
    ctx.body = { msg: "unauthorized" };
  }
};
