import Koa from "koa";
import Compose from "koa-compose";

import { OptionSet } from "@nexys/utils/dist/types";

import JWT from "../../jwt";
import * as T from "../../type";
import * as LT from "./type";
import Cache from "../../cache/cache";
import * as Cookies from "../cookies";

import * as U from "./utils";
// see https://github.com/Nexysweb/koa-lib/blob/master/src/middleware/index.ts

interface RefreshToken {
  profile: any;
  type: "REFRESH";
}

export default class Auth<
  Profile extends T.ObjectWithId<Id>,
  UserCache extends LT.Permissions,
  Id = number
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

  getProfile = (
    token: string,
    ctx: Koa.Context,
    refreshAttempt = 0
  ): Profile => {
    try {
      //console.log(this.jwt.read(token));
      const decoded = this.jwt.verify<Profile>(token);

      // todo if beyond a certain time, gte refresh

      return decoded;
    } catch (err) {
      // try to issue a new token from refresh token
      //console.log("jwt verify failed");

      if (refreshAttempt > 0) {
        throw Error("new access token invalid, aborting here");
      }

      return this.refresh(ctx);
    }
  };

  // todo call database to avoid inifinte renewing
  refresh = (ctx: Koa.Context): Profile => {
    const refreshToken = Cookies.getToken(ctx.cookies, "REFRESH");
    //console.log(refreshToken);

    if (!refreshToken) {
      throw Error("could not get refresh token");
    }

    try {
      //console.log("d");
      const refTokenValue = this.jwt.verify<RefreshToken>(refreshToken);
      //console.log(refTokenValue);
      const newToken = this.jwt.sign(refTokenValue.profile);
      //console.log(newToken, "newtok");
      try {
        Cookies.setToken(newToken, ctx.cookies);
      } catch (err) {
        console.log(err);
      }
      //console.log("set token");
      return this.getProfile(refTokenValue.profile, ctx, 1);
      //console.log("p", p);
      //return p;
    } catch (err) {
      throw Error("JWT refresh invalid");
    }

    //throw Error("JWT invalid");
  };

  getCache = <Id, A>(id: Id): A => this.cache.get(U.getKey(id));

  setCache = (
    profile: Profile,
    cacheData: UserCache
  ): { accessToken: string; refreshToken: string } => {
    this.cache.set(U.cacheUserPrefix + profile.id, cacheData);
    const refreshToken: RefreshToken = { profile, type: "REFRESH" };
    return {
      accessToken: this.jwt.sign(profile),
      refreshToken: this.jwt.sign(refreshToken),
    };
  };

  authFormat = (
    userCache: UserCache,
    profile: Profile,
    locale: OptionSet = { id: 1, name: "en" }
  ): LT.LoginResponse<Profile, Id> => {
    const { accessToken, refreshToken } = this.setCache(profile, userCache);

    return {
      permissions: userCache.permissions,
      accessToken,
      refreshToken,
      profile,
      locale,
    };
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
      const profile: Profile = this.getProfile(token, ctx);
      const userCache: UserCache = this.getCache<Id, UserCache>(profile.id);
      const state: LT.UserState<Id, Profile, UserCache> = {
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
