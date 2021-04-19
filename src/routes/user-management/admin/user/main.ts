import Router from "koa-router";
import bodyParser from "koa-body";

import m from "../../../../middleware/auth";
import Validation, { Utils as VU } from "@nexys/validation";
import * as T from "../../type";
import { ObjectWithId } from "../../../../type";
import { Permissions } from "../../../../middleware/auth/type";

const UserRoutes = <
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
  Id
>(
  { userService }: T.Services,
  MiddlewareAuth: m<Profile, UserCache, Id>
) => {
  const router = new Router();

  router.all(
    "/list",
    bodyParser(),
    MiddlewareAuth.isAuthorized("admin"),
    async (ctx) => {
      const { instance } = ctx.state.profile;
      ctx.body = await userService.list(instance);
    }
  );

  router.post(
    "/detail",
    bodyParser(),
    MiddlewareAuth.isAuthorized("admin"),
    Validation.isShapeMiddleware({
      uuid: { extraCheck: VU.checkUuid },
    }),
    async (ctx) => {
      const { uuid } = ctx.request.body;
      const { instance } = ctx.state.profile;
      ctx.body = await userService.detail(uuid, instance);
    }
  );

  router.post(
    "/insert",
    bodyParser(),
    MiddlewareAuth.isAuthorized("admin"),
    Validation.isShapeMiddleware({
      firstName: {},
      lastName: {},
      email: { extraCheck: VU.emailCheck },

      status: { id: { type: "number" } },
      lang: {},
    }),
    async (ctx) => {
      const user: Profile & {
        status: { id: Id };
      } = ctx.request.body;
      const { instance } = ctx.state.profile;
      ctx.body = await userService.insert({
        ...user,
        instance,
        logDateAdded: new Date(),
      });
    }
  );

  router.post(
    "/update",
    bodyParser(),
    MiddlewareAuth.isAuthorized("admin"),
    Validation.isShapeMiddleware({
      uuid: { extraCheck: VU.checkUuid },
      firstName: {},
      lastName: {},
      email: { extraCheck: VU.emailCheck },
    }),
    async (ctx) => {
      const {
        uuid,
        ...profile
      }: {
        uuid: Id;
      } & Partial<Profile> = ctx.request.body;
      ctx.body = await userService.update(uuid, profile); // todo add instance!
    }
  );

  router.post(
    "/delete",
    bodyParser(),
    MiddlewareAuth.isAuthorized("admin"),
    Validation.isShapeMiddleware({
      uuid: { extraCheck: VU.checkUuid },
    }),
    async (ctx) => {
      const { uuid } = ctx.request.body;

      ctx.request.body = ctx.body = await userService.delete(uuid);
    }
  );

  router.post(
    "/status/change",
    bodyParser(),
    MiddlewareAuth.isAuthorized("admin"),
    Validation.isShapeMiddleware({
      uuid: { extraCheck: VU.checkUuid },
      status: { id: { type: "number", extraCheck: VU.checkId } },
    }),
    async (ctx) => {
      const {
        uuid,
        status,
      }: { uuid: Id; status: { id: Id } } = ctx.request.body;
      ctx.body = await userService.changeStatus(uuid, status.id);
    }
  );

  return router.routes();
};

export default UserRoutes;
