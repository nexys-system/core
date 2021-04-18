import Router from "koa-router";
import bodyParser from "koa-body";

import m from "../../../middleware/auth";
import Validation from "@nexys/validation";
import * as T from "../type";
import { ObjectWithId } from "../../../type";
import { Permissions } from "../../../middleware/auth/type";

const ProfileRoutes = <
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
  Id
>(
  { userService, passwordService }: T.Services,
  MiddlewareAuth: m<Profile, UserCache, Id>
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
      firstName: {},
      lastName: {},
    }),
    async (ctx) => {
      const data: { firstName: string; lastName: string } = ctx.request.body;
      const { uuid } = ctx.state.profile;

      const r = await userService.update(uuid, data);

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
      console.log(uuid, data.password, { uuid: instance.uuid }, data.old);
      const r = await passwordService.setPassword(
        uuid,
        data.password,
        { uuid: instance.uuid },
        data.old
      );
      ctx.body = r;
    }
  );

  return router.routes();
};

export default ProfileRoutes;
