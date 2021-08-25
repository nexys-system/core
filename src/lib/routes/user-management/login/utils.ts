import Koa from "koa";

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
