/**
 * manages acces for user
 * token is either in cookie (httpOnly) or as an auhtorization bearer token
 */
import Koa from "koa";
import Compose from "koa-compose";
import Cache from "@nexys/node-cache/dist/cache";

import JWT from "../../jwt";
import * as T from "../../type";

import * as LT from "./type";
import * as CookiesService from "../cookies";

import * as U from "./utils";
import { AuthService } from "../../user-management";
import { localeToString } from "../../user-management/locale";
// see https://github.com/Nexysweb/koa-lib/blob/master/src/middleware/index.ts

export default class Auth<
  Profile extends T.ObjectWithId<Id>,
  UserCache extends LT.UserCacheDefault,
  Id = number,
  Permission = LT.Permission
> {
  cache: Cache;
  jwt: JWT;
  acceptHeaderToken: boolean;
  loginService: AuthService;
  accessTokenExpires: number;
  permissionValues: LT.PermissionValues;
  tokenAutoRefresh: boolean;

  /**
   *
   * @param cache needed for extra login information
   * @param secret for the JWT verification
   */
  constructor(
    loginService: AuthService,
    cache: Cache,
    secret: string,
    options: Partial<LT.AuthOptions> = {}
  ) {
    this.cache = cache;
    this.jwt = new JWT(secret);
    this.acceptHeaderToken = options.acceptHeaderToken || true;
    this.loginService = loginService;
    this.accessTokenExpires = options.accessTokenExpires || 10 * 60; // after 15min, the access token expires and the refresh token is used to create a new session: - permissions, - status etc are refreshed in the process
    this.permissionValues = options.permissionValues || {
      1: "app",
      2: "admin",
      3: "superadmin",
    };

    this.tokenAutoRefresh = options.tokenAutoRefresh || true;
  }

  getProfile = async (
    token: string,
    ctx: Koa.Context,
    refreshAttempt = 0
  ): Promise<{ profile: Profile; userCache: UserCache }> => {
    try {
      const profile = this.jwt.verify<Profile>(token);
      const userCache: UserCache = this.getCache<Id, UserCache>(profile.id);

      const { iat } = profile;

      if (iat && U.isExpired(iat, this.accessTokenExpires)) {
        if (this.tokenAutoRefresh) {
          return this.refresh(ctx);
        }

        throw Error("token expired");
      }

      return { profile, userCache };
    } catch (err) {
      // try to issue a new token from refresh token
      //console.log("jwt verify failed");

      if (refreshAttempt > 0) {
        throw Error("new access token invalid, aborting here");
      }

      if (this.tokenAutoRefresh) {
        return this.refresh(ctx);
      }

      throw Error("something went wrong while trying to read the profile");
    }
  };

  // todo call database to avoid inifinte renewing
  refresh = async (
    ctx: Koa.Context,
    cookieOpts: {
      secure: boolean;
      sameSite?: boolean | "strict" | "lax" | "none";
    } = { secure: false }
  ): Promise<{ profile: Profile; userCache: UserCache }> => {
    console.info("Refreshing token");
    const refreshToken = CookiesService.getToken(ctx.cookies, "REFRESH");
    //console.log(refreshToken);

    if (!refreshToken) {
      throw Error("could not get refresh token");
    }

    try {
      const { profile, locale, permissions } =
        await this.loginService.reAuthenticate(refreshToken);

      const nProfile: Profile = { id: profile.uuid, ...profile } as any;

      const userCache: UserCache = { permissions, locale } as UserCache;

      const profileWToken = await this.authFormat(
        userCache,
        nProfile,
        refreshToken
      );

      U.login(profileWToken, ctx.cookies, cookieOpts);

      return { profile: nProfile, userCache };
    } catch (err) {
      console.log(err);
      throw Error("JWT refresh invalid");
    }

    //throw Error("JWT invalid");
  };

  getCache = <Id, A>(id: Id): A => this.cache.get(U.getKey(id));

  setCache = async (id: Id, cacheData: UserCache) =>
    this.cache.set(U.getKey(id), cacheData);

  authFormat = async (
    userCache: UserCache,
    profile: Profile,
    refreshToken: string
  ): Promise<LT.LoginResponse<Profile, Id>> => {
    // set cache
    await this.setCache(profile.id, userCache);
    // get access token
    const accessToken = this.jwt.sign(profile);

    const permissionStrings = userCache.permissions.map(
      (p) => this.permissionValues[p]
    );

    return {
      permissions: permissionStrings,
      accessToken,
      refreshToken,
      profile,
      locale: localeToString(userCache.locale),
    };
  };

  authOutput = async (
    ctx: Koa.Context,
    profile: Profile,
    refreshToken: string,
    userCache: UserCache,

    cookieOpts: {
      secure: boolean;
      sameSite?: boolean | "strict" | "lax" | "none";
    } = { secure: true }
  ) => {
    const r = await this.authFormat(userCache, profile, refreshToken);

    ctx.body = U.login(r, ctx.cookies, cookieOpts);
  };

  isAuthenticated =
    () =>
    async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
      const token: string | undefined =
        CookiesService.getToken(ctx.cookies) ||
        (this.acceptHeaderToken
          ? U.extractOptBearerToken(ctx.headers["authorization"] as string)
          : undefined);

      if (token === undefined) {
        ctx.status = 401;
        ctx.body = { message: "isAuthenticated: please provide a token" };
        return;
      }

      try {
        const { profile, userCache } = await this.getProfile(token, ctx);

        const state: LT.UserState<Id, Profile, UserCache> = {
          profile,
          userCache,
        };

        ctx.state = state;
      } catch (err) {
        console.log(err);
        ctx.status = 401;
        ctx.body = { message: "user could not be authenticated" };
        return;
      }
      await next();
    };

  hasPermission =
    (permission: Permission) =>
    async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
      const { userCache }: { userCache: UserCache } = ctx.state as any;
      const { permissions } = userCache;

      if (U.isPermissionValid(permission, permissions as any)) {
        await next();
      } else {
        ctx.status = 403; // return forbidden permission
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
    permission: Permission
  ): Compose.Middleware<
    Koa.ParameterizedContext<Koa.DefaultState, Koa.Context>
  > => Compose([this.isAuthenticated(), this.hasPermission(permission)]);

  /**
   * removes cookies and cache associated with user
   * @param profile
   * @param ctx
   */
  logout = (profile: Profile, ctx: Koa.Context) => {
    CookiesService.removeToken(ctx.cookies);
    this.cache.destroy(U.getKey(profile.id));
  };
}
