import Cookies from "cookies";

const accessTokenKey = "ACCESS_TOKEN";
const refreshTokenKey = "REFRESH_TOKEN";
const metaKey = "META";

export const getToken = (
  cookies: Cookies,
  type: "ACCESS" | "REFRESH" = "ACCESS"
): string | undefined =>
  cookies.get(type === "ACCESS" ? accessTokenKey : refreshTokenKey);

/**
 * swt token in cookie, note httpOlny and secure
 * when setting a cookie, we create both an httpOnly cookie and a "meta" one to be able to know whether the httpOnly exists.
 * see https://stackoverflow.com/questions/9353630/check-if-httponly-cookie-exists-in-javascript
 * @param token: access token
 * @param cookies: Cookies object
 * @param secure y default true, when http throws: `Error: Cannot send secure cookie over unencrypted connection`
 * @param sameSite: https://web.dev/samesite-cookies-explained/
 */
export const setToken = (
  token: string,
  cookies: Cookies,
  secure: boolean = false,
  type: "ACCESS" | "REFRESH" = "ACCESS",
  sameSite?: boolean | "strict" | "lax" | "none"
) => {
  const key = type === "ACCESS" ? accessTokenKey : refreshTokenKey;
  if (type === "ACCESS") {
    // only set meta token when setting access token
    cookies.set(metaKey, new Date().toISOString(), { httpOnly: false });
  }
  return cookies.set(key, token, { httpOnly: true, secure, sameSite });
};

/**
 * removes token for logout
 * @param cookies cookies
 * @see https://github.com/koajs/koa/issues/777#issuecomment-461499834
 */
export const removeToken = (cookies: Cookies) => {
  cookies.set(metaKey, undefined);
  cookies.set(refreshTokenKey, undefined);
  return cookies.set(accessTokenKey, undefined);
};
