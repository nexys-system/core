import Router from "koa-router";
import bodyParser from "koa-body";
import Validation, { Utils as VU } from "@nexys/validation";

import m from "../../../../middleware/auth";
import { Permissions } from "../../../../middleware/auth/type";

import { ObjectWithId } from "../../../../type";
import { Uuid } from "@nexys/utils/dist/types";
import { UserService } from "../../../../user-management";

import { Status } from "../../../../user-management/type";

const UserRoutes = <
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
  Id
>(
  { userService }: { userService: UserService },
  MiddlewareAuth: m<Profile, UserCache, Id>
) => {
  const router = new Router();

  router.post(
    "/list",
    bodyParser(),
    MiddlewareAuth.isAuthorized("superadmin"),
    Validation.isShapeMiddleware({ uuid: { extraCheck: VU.checkUuid } }),
    async (ctx) => {
      const instance = ctx.request.body;
      ctx.body = await userService.list(instance);
    }
  );

  router.post(
    "/detail",
    bodyParser(),
    MiddlewareAuth.isAuthorized("superadmin"),
    Validation.isShapeMiddleware({
      uuid: { extraCheck: VU.checkUuid },
      instance: { uuid: { extraCheck: VU.checkUuid } },
    }),
    async (ctx) => {
      const { uuid, instance } = ctx.request.body;
      ctx.body = await userService.detail(uuid, instance);
    }
  );

  router.post(
    "/insert",
    bodyParser(),
    MiddlewareAuth.isAuthorized("superadmin"),
    Validation.isShapeMiddleware({
      firstName: {},
      lastName: {},
      email: { extraCheck: VU.emailCheck },
      instance: { uuid: { extraCheck: VU.checkUuid } },
      status: { type: "number" },
      lang: {},
    }),
    async (ctx) => {
      const user: Profile & {
        instance: { uuid: Uuid };
        status: Status;
      } = ctx.request.body;
      ctx.body = await userService.insert({
        ...user,
        logDateAdded: new Date(),
      } as any);
    }
  );

  router.post(
    "/update",
    bodyParser(),
    MiddlewareAuth.isAuthorized("superadmin"),
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
        uuid: Uuid;
      } & Partial<Profile> = ctx.request.body;
      ctx.body = await userService.update(uuid, profile as any); // todo add instance!
    }
  );

  router.post(
    "/delete",
    bodyParser(),
    MiddlewareAuth.isAuthorized("superadmin"),
    Validation.isShapeMiddleware({
      uuid: { extraCheck: VU.checkUuid },
    }),
    async (ctx) => {
      const { uuid } = ctx.request.body;

      ctx.request.body = ctx.body = await userService.delete(uuid);
    }
  );

  router.post(
    "/exists",
    bodyParser(),
    MiddlewareAuth.isAuthorized("superadmin"),
    Validation.isShapeMiddleware({
      email: { extraCheck: VU.emailCheck },
      instance: { uuid: { extraCheck: VU.checkUuid } },
    }),
    async (ctx) => {
      const { name } = ctx.request.body;
      ctx.body = await userService.getByEmail(name);
    }
  );

  router.post(
    "/status/change",
    bodyParser(),
    MiddlewareAuth.isAuthorized("superadmin"),
    Validation.isShapeMiddleware({
      uuid: { extraCheck: VU.checkUuid },
      status: { type: "number", extraCheck: VU.checkId },
    }),
    async (ctx) => {
      const { uuid, status }: { uuid: Uuid; status: Status } = ctx.request.body;
      ctx.body = await userService.changeStatus(uuid, status);
    }
  );

  return router.routes();
};

export default UserRoutes;
