import { checkLogin, isSignupShape } from "./validation";

import Router from "koa-router";
import bodyParser from "koa-body";

import m from "../../../middleware/auth";

import { ObjectWithId } from "../../../type";
import { Permissions } from "../../../middleware/auth/type";
import { Uuid } from "@nexys/utils/dist/types";
import { LoginService } from "../../../user-management";

/**  const instance = {
    uuid: process.env.InstanceUuid || "",
    name: process.env.InstanceName || "",
  }; */

const LoginRoutes = <Profile extends ObjectWithId<Id>, Id>(
  { loginService }: { loginService: LoginService },
  MiddlewareAuth: m<Profile, Permissions, Id>,
  instance: { uuid: Uuid; name: string }
) => {
  const router = new Router();

  const langDefault = { id: 1, name: "en" };

  router.post("/", bodyParser(), checkLogin, async (ctx) => {
    const { email, password } = ctx.request.body;

    const userAgent: string | undefined = ctx.request.headers["user-agent"];
    const ip: string = ctx.request.ip;

    try {
      const { profile, permissions, refreshToken } =
        await loginService.authenticate(
          email,
          password,
          {
            uuid: instance.uuid,
          },
          { userAgent, ip }
        );
      const lang = langDefault;

      const nProfile: Profile = { id: profile.uuid, ...profile } as any;

      MiddlewareAuth.authOutput(
        ctx,
        nProfile,
        refreshToken,
        { permissions },
        lang,
        {
          secure: false,
        }
      );
    } catch (err) {
      ctx.status = 400;
      ctx.body = { error: err.message };
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
    const profile = {
      ...signupProfile,
      lang: langDefault.name,
      instance,
      logDateAdded: new Date(),
    };

    try {
      const { uuid, token } = await loginService.signup(profile, password, [
        "app",
      ]);

      console.log("should send email with " + token);

      ctx.body = { uuid };
    } catch (err) {
      console.log(err);
      ctx.body = err;
    }
  });

  router.all("/activate", async (ctx) => {
    const { challenge } = ctx.query;

    if (!challenge || typeof challenge !== "string") {
      ctx.status = 400;
      ctx.body = { error: "challenge must be given" };
      return;
    }

    ctx.body = await loginService.activate(challenge);
  });

  return router.routes();
};

export default LoginRoutes;
