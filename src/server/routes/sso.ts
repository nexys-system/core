import Router from "koa-router";

import * as Config from "../config";

import * as OAuth from "@nexys/oauth";
import * as IBMAuth from "@tssbpchannel/sso";
import { AuthenticationType } from "../../lib/user-management/crud-type";

import Product from "../product";
import { getIPandUserAgent } from "../../lib/routes/user-management/login/utils";

import { IBMID, Type } from "@tssbpchannel/sso";

const publicKey =
  "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtbLV6yge386z4xvlRAuX\n76/Uj1Ef/98JQSIFN0CqqzwF4KT/4o1jsdaPNp+kJdkPaOkBHe7n9faIXuT+gN4S\niWQodh2y0xsj31luJF0WnLjmdkDcDRSm/d1TcnAst8DA/0MkhRKBYcXA9YEpAvea\naPOq9O+0wyPsccuIsxMez9ix4NjkIEds8q6VvWYOnUfF+vxbi/aVXRN7JRV8k8XV\n0ipcaLO5oNnENMzQKAkyhuUw3HkRChbtW5uD7StyIn58J6o6ux2aNJwjtga1ZnQ7\n03YLci20ahRex2T33IgmrxJNORGFy/MJd+Nxm3IoXCLwEBoOou0HjQ0dX8V45kLb\nPwIDAQAB\n-----END PUBLIC KEY-----";
const issuer = "login.ibm.com";
const id = "OWExNWVkYjYtZjE0Zi00";
const secret = "ODc0ODI4YjktZDE5NS00";

const redirectHost: string =
  process.env.SSO_REDIRECT || "local.tssmadeeasy.com";

const config: Type.Config = {
  issuer: { host: issuer, path: "/v1.0/endpoint/default" },
  client: {
    id,
    secret,
  },
  publicKey,
  redirect: { host: redirectHost, path: "/sso/redirect" },
};

const sso = new IBMID(config);

const router = new Router();

router.get("/url", async (ctx) => {
  ctx.redirect(sso.getRedirectUrl());
});

router.get("/ibm/redirect", async (ctx) => {
  const { code } = ctx.query;
  const token = await sso.request(code as string);

  console.log(token);

  try {
    const l = await Product.loginService.authenticate(
      token.email,
      Config.instance,
      { type: AuthenticationType.ibm },
      getIPandUserAgent(ctx)
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
      getIPandUserAgent(ctx)
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
