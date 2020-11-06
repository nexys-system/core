import Cookies from "cookies";

const tokenKey = "ACCESS_TOKEN";

export const getToken = (cookies: Cookies): string | undefined =>
  cookies.get(tokenKey);

export const setToken = (token: string, cookies: Cookies) =>
  cookies.set(tokenKey, token, { httpOnly: true, secure: true });
