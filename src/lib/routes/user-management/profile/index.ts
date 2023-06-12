import Router from "koa-router";
import bodyParser from "koa-body";

import m from "../../../middleware/auth";
import { Main as Validation } from "@nexys/validation";

import { UserCacheDefault } from "../../../middleware/auth/type";

import {
  UserService,
  PasswordService,
  UserTokenService,
} from "../../../user-management";

import Profile2FaRoutes from "./two-fa";
import ProfileTokenRoutes from "./token";

const ProfileRoutes = <UserCache extends UserCacheDefault>(
  {
    userService,
    passwordService,
    userTokenService,
  }: {
    userService: UserService;
    passwordService: PasswordService;
    userTokenService: UserTokenService;
  },
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

  router.use("/2fa", Profile2FaRoutes({ userService }, MiddlewareAuth));
  router.use(
    "/token",
    ProfileTokenRoutes({ userTokenService }, MiddlewareAuth)
  );

  return router.routes();
};

export default ProfileRoutes;
