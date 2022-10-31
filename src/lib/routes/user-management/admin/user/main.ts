import Router from "koa-router";
import bodyParser from "koa-body";

import m from "../../../../middleware/auth";
import { Main as Validation, Utils as VU } from "@nexys/validation";

import { ObjectWithId } from "../../../../type";

import { UserService } from "../../../../user-management";
import { Permission, User } from "../../../../user-management/crud-type";
import * as T from "../../../../user-management/type";
import { UserCacheDefault } from "../../../../middleware/auth/type";

type Uuid = string;

const UserRoutes = <
  Profile extends ObjectWithId<Id>,
  UserCache extends UserCacheDefault,
  Id
>(
  { userService }: { userService: UserService },
  MiddlewareAuth: m<UserCache>
) => {
  const router = new Router();

  router.all(
    "/list",
    bodyParser(),
    MiddlewareAuth.isAuthorized(Permission.admin),
    async (ctx) => {
      const { instance } = ctx.state.profile;
      ctx.body = await userService.list(instance);
    }
  );

  router.post(
    "/detail",
    bodyParser(),
    MiddlewareAuth.isAuthorized(Permission.admin),
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
    MiddlewareAuth.isAuthorized(Permission.admin),
    Validation.isShapeMiddleware({
      firstName: {},
      lastName: {},
      email: { extraCheck: VU.emailCheck },
      status: { type: "number" },
      lang: {},
    }),
    async (ctx) => {
      const user: Profile & {
        status: T.Status;
      } = ctx.request.body;
      const { instance } = ctx.state.profile;

      const userRow: Omit<User, "uuid"> = {
        ...user,
        instance,
        logDateAdded: new Date(),
      } as any;

      ctx.body = await userService.insert(userRow);
    }
  );

  router.post(
    "/update",
    bodyParser(),
    MiddlewareAuth.isAuthorized(Permission.admin),
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
    MiddlewareAuth.isAuthorized(Permission.admin),
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
    MiddlewareAuth.isAuthorized(Permission.admin),
    Validation.isShapeMiddleware({
      uuid: { extraCheck: VU.checkUuid },
      status: { type: "number" },
    }),
    async (ctx) => {
      const { uuid, status }: { uuid: Uuid; status: T.Status } =
        ctx.request.body;
      ctx.body = await userService.changeStatus(uuid, status);
    }
  );

  return router.routes();
};

export default UserRoutes;
