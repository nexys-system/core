import Router from "koa-router";
import SsoAbstract from "./abstract";

const ssoRoutes = <A, B = any>(
  router: Router,
  SSO: SsoAbstract<A>,
  loginAuthenticate: (profile: A) => Promise<B>,
  paths: { url: string; redirect: string } = {
    url: "/url",
    redirect: "/redirect",
  }
) => {
  router.get(paths.url, async (ctx) => {
    const url = SSO.oAuthUrl();

    ctx.body = { url };
  });

  router.get(paths.redirect, async (ctx) => {
    const { code } = ctx.request.query;
    const token = await SSO.callback(code);
    const profile: A = await SSO.getProfile(token);
    ctx.body = await loginAuthenticate(profile);
  });

  return router.routes();
};

export default ssoRoutes;
