import Cookies from "cookies";

const tokenKey = "ACCESS_TOKEN";

export const getToken = (cookies: Cookies): string | undefined =>
  cookies.get(tokenKey);

/**
 * swt token in cookie, note httpOlny and secure
 * @param token
 * @param cookies
 * @param secure y default true, when http throws: `Error: Cannot send secure cookie over unencrypted connection`
 * @param sameSite: https://web.dev/samesite-cookies-explained/
 */
export const setToken = (
  token: string,
  cookies: Cookies,
  secure: boolean = true,
  sameSite?: boolean | "strict" | "lax" | "none"
) => cookies.set(tokenKey, token, { httpOnly: true, secure, sameSite });
