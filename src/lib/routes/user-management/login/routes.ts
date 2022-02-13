import { checkLogin, isSignupShape } from "./validation";

import Router from "koa-router";
import bodyParser from "koa-body";

import m from "../../../middleware/auth";

import { ObjectWithId } from "../../../type";
import { Locale, UserCacheDefault } from "../../../middleware/auth/type";
import { LoginService } from "../../../user-management";
import { headerAcceptLanguageToLocale } from "../../../user-management/locale";
import {
  AuthenticationType,
  Permission,
} from "../../../user-management/crud-type";

type Uuid = string;

/**  const instance = {
    uuid: process.env.InstanceUuid || "",
    name: process.env.InstanceName || "",
  }; */

const LoginRoutes = <Profile extends ObjectWithId<Id>, Id>(
  { loginService }: { loginService: LoginService },
  MiddlewareAuth: m<Profile, UserCacheDefault, Id>,
  instance: { uuid: Uuid; name: string }
) => {
  const router = new Router();

  router.post("/login", bodyParser(), checkLogin, async (ctx) => {
    // get email, password and instance from request body
    // note the instance is optional, if not given the default instance is taken
    const { email, password, instance =  { uuid: instance.uuid }} = ctx.request.body;

    const userAgent: string | undefined = ctx.request.headers["user-agent"];
    const ip: string = ctx.request.ip;

    try {
      const { profile, locale, permissions, refreshToken } =
        await loginService.authenticate(
          email,
          instance,
          { password, type: AuthenticationType.password },
          { userAgent, ip }
        );

      const nProfile: Profile = { id: profile.uuid, ...profile } as any;

      MiddlewareAuth.authOutput(
        ctx,
        nProfile,
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
    await loginService.logout(
      ctx.state.profile.id,
      ctx.cookies.get("REFRESH_TOKEN")
    );
    ctx.body = { message: "logged out successfully" };
  });

  router.post("/signup", bodyParser(), isSignupShape, async (ctx) => {
    const { password, ...signupProfile } = ctx.request.body;

    const locale: Locale = headerAcceptLanguageToLocale(
      ctx.headers["accept-language"]
    );

    const profile = {
      ...signupProfile,
      instance,
      logDateAdded: new Date(),
    };

    try {
      const { uuid, token } = await loginService.signup(
        profile,
        password,
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

    const success = await loginService.activate(challenge);

    ctx.body = { success };
  });

  router.all("/refresh", async (ctx) => {
    const { profile } = await MiddlewareAuth.refresh(ctx);
    ctx.body = profile;
  });

  return router.routes();
};

export default LoginRoutes;
