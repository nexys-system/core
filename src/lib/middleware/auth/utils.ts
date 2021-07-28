import Koa from "koa";
import * as CookiesService from "../cookies";
import Cookies from "cookies";
import { Locale } from "./type";

export const readTokenHeaders = (headers: {
  authorization?: string;
}): string | null => {
  if (headers.authorization) {
    return headers.authorization.substr(7);
  }

  return null;
};

export const login = <A extends { accessToken: string; refreshToken: string }>(
  profileWToken: A,
  ctxCookies: Cookies,
  cookieOpts: {
    secure: boolean;
    sameSite?: boolean | "strict" | "lax" | "none";
  } = { secure: true }
): Omit<A, "accessToken" | "refreshToken"> => {
  const { accessToken, refreshToken, ...rest }: A = profileWToken;
  //const b: Omit<A, "token"> = rest;

  console.log("gfd");

  // set token in cookie
  CookiesService.setToken(
    accessToken,
    ctxCookies,
    cookieOpts.secure,
    "ACCESS",
    cookieOpts.sameSite
  );

  console.log("gfd");

  //console.log("set refresh");
  CookiesService.setToken(
    refreshToken,
    ctxCookies,
    cookieOpts.secure,
    "REFRESH",
    cookieOpts.sameSite
  );

  console.log("gfd3");

  return rest;
};

export const logout = (ctx: Koa.Context) => {
  CookiesService.removeToken(ctx.cookies);

  ctx.body = { msg: "cookies removed" };
};

export const cacheUserPrefix: string = "user-";

export const isPermissionValid = (
  permissionRequired: string,
  userPermissions: string[]
): boolean => userPermissions.includes(permissionRequired);

export const extractBasicAuthToken = (s: string): string => s.slice(6);

export const createBasicAuthToken = (username: string, password: string) =>
  Buffer.from(username + ":" + password).toString("base64");

export const createBasicAuthHeaderString = (
  username: string,
  password: string
) => "Basic " + createBasicAuthToken(username, password);

export const getKey = <Id>(id: Id) => cacheUserPrefix + id;

export const extractBearerToken = (s: string): string =>
  s.slice("bearer ".length);

export const extractOptBearerToken = (s?: string): string | undefined =>
  s ? extractBearerToken(s) : undefined;

export const isExpired = (iat: number, accessTokenExpires: number): boolean => {
  const t = new Date().getTime() / 1000;
  //console.log({ iat, t });

  return iat + accessTokenExpires < t;
};
