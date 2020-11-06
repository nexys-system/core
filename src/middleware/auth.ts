import Koa from "koa";
import Compose from "koa-compose";
import * as JWT from "../jwt";
import * as T from "../type";
import Cache from "../cache/cache";
import * as Cookies from "./cookies";

// see https://github.com/Nexysweb/koa-lib/blob/master/src/middleware/index.ts

export const OLDreadToken = (headers: {
  authorization?: string;
}): string | null => {
  if (headers.authorization) {
    return headers.authorization.substr(7);
  }

  return null;
};

export interface UserState<Profile, UserCache> {
  profile: Profile;
  userCache: UserCache;
}

export const login = <A extends { token: string }>(
  profileWToken: A,
  ctx: Koa.Context
) => {
  const { token, ...rest }: A = profileWToken;
  //const b: Omit<A, "token"> = rest;

  // set token in cookie
  Cookies.setToken(token, ctx.cookies);

  ctx.body = rest;
};

const cacheUserPrefix: string = "user-";

export default class Auth<Profile extends T.ObjectWithId, UserCache> {
  cache: Cache;

  constructor(cache: Cache) {
    this.cache = cache;
  }

  getProfile = (token: string): Profile => JWT.verify<Profile>(token);

  getCache = <A>(id: T.Id): A => this.cache.get(cacheUserPrefix + id);

  isAuthenticated = () => async (
    ctx: Koa.Context,
    next: Koa.Next
  ): Promise<void> => {
    const token = Cookies.getToken(ctx.cookies);

    if (token === undefined) {
      ctx.status = 401;
      ctx.body = { message: "please provide a token" };
      return;
    }

    try {
      const profile: Profile = this.getProfile(token);
      const userCache: UserCache = this.getCache<UserCache>(profile.id);
      const state: UserState<Profile, UserCache> = {
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
    const { user } = ctx;
    const { permissions } = this.getCache(user.id);

    if (this.isPermissionValid(permission, permissions)) {
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

  isPermissionValid = (
    permissionRequired: string,
    userPermissions: string[]
  ): boolean => userPermissions.includes(permissionRequired);

  isAuthorized = (
    permission: string
  ): Compose.Middleware<
    Koa.ParameterizedContext<Koa.DefaultState, Koa.Context>
  > => Compose([this.isAuthenticated(), this.hasPermission(permission)]);
}
