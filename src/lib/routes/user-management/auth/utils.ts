import Koa from "koa";
import { AuthOut, UserMeta } from "../../../user-management/type";

/**
 * helper to get user login meta
 */
export const getIPandUserAgent = (
  ctx: Koa.Context
): { ip: string; userAgent?: string } => {
  const ip = ctx.request.ip;
  const userAgent = ctx.request.header["user-agent"];

  return { ip, userAgent };
};

/**
 * can't take the "normal" because it will return the internal docker ip, need to take the real-ip, added in proxy pass
 *  see https://github.com/nexys-system/display-ip/blob/master/src/app.ts#L9
 */
export const formatIP = (headers: {
  [k: string]: string | string[] | undefined;
}): string => {
  const headerKey = "x-real-ip";
  const realIP: string | string[] | undefined = headers[headerKey];

  if (typeof realIP === "string") {
    return realIP;
  }

  return "undefined";
};

export const isAuthOut = (a: AuthOut | any): a is AuthOut =>
  typeof a.profile == "object" &&
  typeof a.permissions === "object" &&
  typeof a.locale === "object";

export const getUserMeta = (ctx: Koa.Context): UserMeta => {
  const { headers } = ctx;

  const userAgent: string | undefined = headers["user-agent"];
  const ip: string = formatIP(headers);

  return { userAgent, ip };
};
