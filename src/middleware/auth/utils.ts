import Koa from "koa";

import * as Cookies from "../cookies";

export const readTokenHeaders = (headers: {
  authorization?: string;
}): string | null => {
  if (headers.authorization) {
    return headers.authorization.substr(7);
  }

  return null;
};

export const login = <A extends { token: string }>(
  profileWToken: A,
  ctx: Koa.Context,
  cookieOpts: {
    secure: boolean;
    sameSite?: boolean | "strict" | "lax" | "none";
  } = { secure: true }
) => {
  const { token, ...rest }: A = profileWToken;
  //const b: Omit<A, "token"> = rest;

  // set token in cookie
  Cookies.setToken(token, ctx.cookies, cookieOpts.secure, cookieOpts.sameSite);

  ctx.body = rest;
};

export const cacheUserPrefix: string = "user-";

export const isPermissionValid = (
  permissionRequired: string,
  userPermissions: string[]
): boolean => userPermissions.includes(permissionRequired);
