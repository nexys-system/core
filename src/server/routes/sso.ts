import Router from "koa-router";

import * as Config from "../config";

import * as OAuth from "@nexys/oauth";
import { AuthenticationType } from "../../lib/user-management/crud-type";

import Product from "../product";

const gh = new OAuth.Github(
  Config.ssoGithub.client_id,
  Config.ssoGithub.client_secret,
  "http://localhost:3000" + "/sso/github/redirect"
);

const router = new Router();

router.get("/url", async (ctx) => {
  ctx.redirect(gh.oAuthUrl());
});

router.get("/github/redirect", async (ctx) => {
  const { code } = ctx.query;
  const token = await gh.callback(code as string);
  const profile = await gh.getProfile(token);

  try {
    const l = await Product.loginService.authenticate(
      profile.login,
      Config.instance,
      { type: AuthenticationType.github },
      { ip: "" }
    );

    await Product.middlewareAuth.authOutput(
      ctx,
      l.profile as any,
      l.refreshToken,
      { permissions: l.permissions },
      l.locale,
      { secure: false }
    );
  } catch (err) {
    ctx.body = { message: err };
  }
});

router.get("/username", async (ctx) => {
  const { login } = ctx.query;

  if (!login || typeof login !== "string") {
    throw Error("login required");
  }

  try {
    const l = await Product.loginService.authenticate(
      login,
      Config.instance,
      { type: AuthenticationType.ibm },
      { ip: "" }
    );

    await Product.middlewareAuth.authOutput(
      ctx,
      l.profile as any,
      l.refreshToken,
      { permissions: l.permissions },
      l.locale,
      { secure: false }
    );
  } catch (err) {
    console.log("here");
    ctx.body = { message: err };
  }
});

export default router.routes();
