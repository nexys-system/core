import Router from "koa-router";
import bodyParser from "koa-body";

import m from "../../../middleware/auth";
import { Locale, UserCacheDefault } from "../../../middleware/auth/type";

import { AuthService } from "../../../user-management";
import { headerAcceptLanguageToLocale } from "../../../user-management/locale";
import {
  AuthenticationType,
  Permission,
} from "../../../user-management/crud-type";

import { Signup } from "./type";
import { getUserMeta, isAuthOut } from "./utils";
import { checkLogin, isSignupShape, twoFaShape } from "./validation";
import { Profile } from "../../../user-management/type";

type Uuid = string;

const AuthRoutes = (
  { authService }: { authService: AuthService },
  MiddlewareAuth: m<UserCacheDefault>,
  instance: { uuid: Uuid; name: string }
) => {
  const router = new Router();
  const instanceDefault = { uuid: instance.uuid };

  router.post("/login", bodyParser(), checkLogin, async (ctx) => {
    // get email, password and instance from request body
    // note the instance is optional, if not given the default instance is taken
    const { email, password, instance = instanceDefault } = ctx.request.body;

    if (!instance || instance === "") {
      ctx.status = 400;
      ctx.body = {
        error: "instance not given: " + JSON.stringify({ instance }),
      };
      return;
    }

    const userMeta = getUserMeta(ctx);

    try {
      const r = await authService.authenticate(
        email,
        instance,
        { password, type: AuthenticationType.password },
        userMeta
      );

      if (!isAuthOut(r)) {
        ctx.status = 403;
        ctx.body = r;
        return;
      }
      const { profile, locale, permissions, refreshToken } = r;

      await MiddlewareAuth.authOutput(
        ctx,
        profile,
        refreshToken,
        { permissions, locale },

        {
          secure: false,
        }
      );
    } catch (err) {
      ctx.status = 400;
      ctx.body = { error: (err as any).message };
      return;
    }
  });

  router.all("/logout", MiddlewareAuth.isAuthenticated(), async (ctx) => {
    const profile = ctx.state.profile as Profile;
    MiddlewareAuth.logout(profile, ctx);
    await authService.logout(
      ctx.state.profile.id,
      ctx.cookies.get("REFRESH_TOKEN")
    );
    ctx.body = { message: "logged out successfully" };
  });

  router.post("/signup", bodyParser(), isSignupShape, async (ctx) => {
    const { auth, ...signupProfile }: Signup = ctx.request.body;

    const locale: Locale = headerAcceptLanguageToLocale(
      ctx.headers["accept-language"]
    );

    const profile = {
      ...signupProfile,
      instance,
      logDateAdded: new Date(),
    };

    const authPostProcessed = {
      type: auth.type || AuthenticationType.password,
      value: auth.password || auth.value || profile.email,
    };

    try {
      const { uuid, token } = await authService.signup(
        profile,
        authPostProcessed,
        locale,
        [Permission.app]
      );

      console.log("should send email with " + token);

      ctx.body = { uuid };
    } catch (err) {
      console.log(err);
      ctx.status = 400;
      ctx.body = err;
      return;
    }
  });

  router.all("/activate", async (ctx) => {
    const { challenge } = ctx.query;

    if (!challenge || typeof challenge !== "string") {
      ctx.status = 400;
      ctx.body = { error: "challenge must be given" };
      return;
    }

    const success = await authService.activate(challenge);

    ctx.body = { success };
  });

  router.all("/refresh", async (ctx) => {
    const { profile } = await MiddlewareAuth.refresh(ctx);
    ctx.body = profile;
  });

  router.post("/2fa", bodyParser(), twoFaShape, async (ctx) => {
    const { payload, code }: { payload: string; code: number } =
      ctx.request.body;
    const userMeta = getUserMeta(ctx);

    try {
      const { profile, locale, permissions, refreshToken } =
        await authService.authenticate2Fa(code, payload, userMeta);

      await MiddlewareAuth.authOutput(
        ctx,
        profile,
        refreshToken,
        { permissions, locale },

        {
          secure: false,
        }
      );
    } catch (err) {
      ctx.status = 400;
      ctx.body = { error: (err as any).message };
      return;
    }
  });

  return router.routes();
};

export default AuthRoutes;
