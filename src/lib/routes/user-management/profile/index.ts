import Router from "koa-router";
import bodyParser from "koa-body";

import m from "../../../middleware/auth";
import { Main as Validation } from "@nexys/validation";

import { UserCacheDefault } from "../../../middleware/auth/type";

import { UserService, PasswordService } from "../../../user-management";
import { verifyTOTP } from "@nexys/timebasedotp";
import { secretFromUrl } from "@nexys/timebasedotp/dist/utils";

const ProfileRoutes = <UserCache extends UserCacheDefault>(
  {
    userService,
    passwordService,
  }: { userService: UserService; passwordService: PasswordService },
  MiddlewareAuth: m<UserCache>
) => {
  const router = new Router();

  router.all(
    "/",
    bodyParser(),
    MiddlewareAuth.isAuthenticated(),
    async (ctx) => {
      ctx.body = ctx.state.profile;
    }
  );

  router.post(
    "/update",
    bodyParser(),
    MiddlewareAuth.isAuthenticated(),
    Validation.isShapeMiddleware({
      firstName: { optional: true },
      lastName: { optional: true },
    }),
    async (ctx) => {
      const data: { firstName: string; lastName: string } = ctx.request.body;
      const { id } = ctx.state.profile;

      if (Object.keys(data).length === 0) {
        ctx.status = 400;
        ctx.body = { message: "the provided payload is empty, aborting" };
        return;
      }

      const r = await userService.update(id, data);

      if (!r.success) {
        throw Error("could not update the profile");
      }

      ctx.body = {
        message:
          "profile updated successfully, since the profile is in the cookie a refresh is necessary",
      };
    }
  );

  router.post(
    "/password/change",
    bodyParser(),
    MiddlewareAuth.isAuthenticated(),
    Validation.isShapeMiddleware({
      old: {},
      password: {},
    }),
    async (ctx) => {
      const data: { password: string; old: string } = ctx.request.body;
      const { uuid, instance } = ctx.state.profile;

      try {
        const r = await passwordService.setPassword(
          uuid,
          data.password,
          { uuid: instance.uuid },
          data.old
        );
        ctx.body = r;
      } catch (err) {
        ctx.status = 400;
        ctx.body = err;
      }
    }
  );

  router.all("/2fa/status", MiddlewareAuth.isAuthenticated(), async (ctx) => {
    const { id, instance } = ctx.state.profile;

    const r = await userService.detail(id, instance);

    const isSet: boolean = !!r.faSecret;

    ctx.body = { isSet };
  });

  router.all("/2fa/reset", MiddlewareAuth.isAuthenticated(), async (ctx) => {
    const { id } = ctx.state.profile;

    const r = await userService.update(id, { faSecret: null } as any);

    ctx.body = { r };
  });

  router.post(
    "/2fa/set",
    bodyParser(),
    MiddlewareAuth.isAuthenticated(),
    Validation.isShapeMiddleware({ code: { type: "number" }, secretUrl: {} }),
    async (ctx) => {
      const { id } = ctx.state.profile;
      const { code, secretUrl } = ctx.request.body;

      const secret = secretFromUrl(secretUrl);

      const verification: boolean = verifyTOTP(code, secret);

      if (verification === false) {
        ctx.body = { verification };
        return;
      }

      const r = await userService.update(id, { faSecret: secret });

      ctx.body = { verification, r };
    }
  );

  return router.routes();
};

export default ProfileRoutes;
