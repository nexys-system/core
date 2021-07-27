import Koa from "koa";
import Compose from "koa-compose";

import { OptionSet } from "@nexys/utils/dist/types";

import JWT from "../../jwt";
import * as T from "../../type";

import * as LT from "./type";
import Cache from "../../cache/cache";
import * as CookiesService from "../cookies";

import * as U from "./utils";
import { LoginService } from "../../user-management";
// see https://github.com/Nexysweb/koa-lib/blob/master/src/middleware/index.ts

const dtExpires = 15 * 60; // after 15min, the access token expires and the refresh token is used to create a new session: - permissions, - status etc are refreshed in the process

export default class Auth<
  Profile extends T.ObjectWithId<Id>,
  UserCache extends LT.Permissions,
  Id = number
> {
  cache: Cache;
  jwt: JWT;
  acceptHeaderToken: boolean;
  loginService: LoginService;

  /**
   *
   * @param cache needed for extra login information
   * @param secret for the JWT verification
   */
  constructor(
    loginService: LoginService,
    cache: Cache,
    secret: string,
    acceptHeaderToken: boolean = false
  ) {
    this.cache = cache;
    this.jwt = new JWT(secret);
    this.acceptHeaderToken = acceptHeaderToken;
    this.loginService = loginService;
  }

  getProfile = async (
    token: string,
    ctx: Koa.Context,
    refreshAttempt = 0
  ): Promise<Profile> => {
    try {
      //console.log(this.jwt.read(token));
      const profile = this.jwt.verify<Profile>(token);

      // todo if beyond a certain time, gte refresh

      const { iat } = profile;
      const t = new Date().getTime() / 1000;
      //console.log({ iat, t });

      if (iat && iat + dtExpires < t) {
        //ctx.status = 401;
        //ctx.body = { message: "token expired" };
        return this.refresh(ctx);
      }

      return profile;
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
  refresh = async (
    ctx: Koa.Context,
    cookieOpts: {
      secure: boolean;
      sameSite?: boolean | "strict" | "lax" | "none";
    } = { secure: false }
  ): Promise<Profile> => {
    console.info("Refreshing token");
    const refreshToken = CookiesService.getToken(ctx.cookies, "REFRESH");
    //console.log(refreshToken);

    if (!refreshToken) {
      throw Error("could not get refresh token");
    }

    try {
      //console.log("d");
      // const refTokenValue =
      // this.jwt.verify<TA.RefreshToken<Profile>>(refreshToken);
      //console.log(refTokenValue);

      const { profile, permissions }: { profile: any; permissions: string[] } =
        await this.loginService.reAuthenticate(refreshToken);

      const nProfile: Profile = { id: profile.uuid, ...profile } as any;

      const userCache: UserCache = { permissions } as UserCache;

      const profileWToken = await this.authFormat(
        userCache,
        nProfile,
        refreshToken,
        {
          id: 1,
          name: "EN-us",
        }
      );

      U.login(profileWToken, ctx.cookies, cookieOpts);

      //console.log("set token");
      //return this.getProfile(refTokenValue.profile, ctx, 1);
      //console.log("p", p);
      //return p;
      return nProfile;
    } catch (err) {
      console.log(err);
      throw Error("JWT refresh invalid");
    }

    //throw Error("JWT invalid");
  };

  getCache = <Id, A>(id: Id): A => this.cache.get(U.getKey(id));

  setCache = async (profile: Profile, cacheData: UserCache) =>
    this.cache.set(U.getKey(profile.id), cacheData);

  authFormat = async (
    userCache: UserCache,
    profile: Profile,
    refreshToken: string,
    locale: OptionSet = { id: 1, name: "en" }
  ): Promise<LT.LoginResponse<Profile, Id>> => {
    // set cache
    await this.setCache(profile, userCache);
    // get access token
    const accessToken = this.jwt.sign(profile);

    return {
      permissions: userCache.permissions,
      accessToken,
      refreshToken,
      profile,
      locale,
    };
  };

  authOutput = async (
    ctx: Koa.Context,
    profile: Profile,
    refreshToken: string,
    userCache: UserCache,
    locale: OptionSet = { id: 1, name: "en" },
    cookieOpts: {
      secure: boolean;
      sameSite?: boolean | "strict" | "lax" | "none";
    } = { secure: true }
  ) => {
    const r = await this.authFormat(userCache, profile, refreshToken, locale);

    ctx.body = U.login(r, ctx.cookies, cookieOpts);
  };

  isAuthenticated =
    () =>
    async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
      const token: string | undefined =
        CookiesService.getToken(ctx.cookies) ||
        (this.acceptHeaderToken
          ? U.extractOptBearerToken(ctx.headers["Authorization"] as string)
          : undefined);

      if (token === undefined) {
        ctx.status = 401;
        ctx.body = { message: "please provide a token" };
        return;
      }

      try {
        const profile = await this.getProfile(token, ctx);
        const userCache: UserCache = this.getCache<Id, UserCache>(profile.id);
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
    (permission: string) =>
    async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
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
    CookiesService.removeToken(ctx.cookies);
    this.cache.destroy(U.getKey(profile.id));
  };
}

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
