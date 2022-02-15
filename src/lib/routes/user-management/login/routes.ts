import Router from "koa-router";
import bodyParser from "koa-body";

import { ObjectWithId } from "../../../type";
import m from "../../../middleware/auth";
import { Locale, UserCacheDefault } from "../../../middleware/auth/type";
import { LoginService } from "../../../user-management";
import { headerAcceptLanguageToLocale } from "../../../user-management/locale";
import {
  AuthenticationType,
  Permission,
} from "../../../user-management/crud-type";

import { checkLogin, isSignupShape } from "./validation";

type Uuid = string;

/**
 * can't take the "normal" because it will return the internal docker ip, need to take the real-ip, added in proxy pass
 *  see https://github.com/nexys-system/display-ip/blob/master/src/app.ts#L9
 */
const formatIp = (headers: { [k: string]: string | string[] | undefined }):string => {
  const headerKey = "x-real-ip";
  const realIP: string | string[] | undefined = headers[headerKey];
  
  if (typeof realIP === 'string') {
    return realIP;
  }
  
  return 'undefined';
}

const LoginRoutes = <Profile extends ObjectWithId<Id>, Id>(
  { loginService }: { loginService: LoginService },
  MiddlewareAuth: m<Profile, UserCacheDefault, Id>,
  instance: { uuid: Uuid; name: string }
) => {
  const router = new Router();
  const instanceDefault = { uuid: instance.uuid };

  router.post("/login", bodyParser(), checkLogin, async (ctx) => {
    // get email, password and instance from request body
    // note the instance is optional, if not given the default instance is taken
    const { email, password, instance = instanceDefault } = ctx.request.body;
    
    const { headers } = ctx;

    const userAgent: string | undefined = headers["user-agent"];
    const ip:string  = formatIP(headers);

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
