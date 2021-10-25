import Router from "koa-router";
import bodyParser from "koa-body";
import { Main as Validation, Utils as VU } from "@nexys/validation";

import m from "../../../../middleware/auth";
import { UserCacheDefault } from "../../../../middleware/auth/type";

import * as T from "../../../../user-management/crud-type";
import { ObjectWithId } from "../../../../type";
import { UserAuthentication } from "../../../../user-management";

const UserAuthenticationService = <
  Profile extends ObjectWithId<Id>,
  UserCache extends UserCacheDefault,
  Id
>(
  {
    userAuthenticationService,
  }: { userAuthenticationService: UserAuthentication },
  MiddlewareAuth: m<Profile, UserCache, Id>
) => {
  const router = new Router();

  router.post(
    "/list",
    bodyParser(),
    MiddlewareAuth.isAuthorized(T.Permission.superadmin),
    Validation.isShapeMiddleware({ uuid: { extraCheck: VU.checkUuid } }),
    async (ctx) => {
      const { uuid } = ctx.request.body;
      ctx.body = await userAuthenticationService.list({ uuid });
    }
  );

  router.post(
    "/detail",
    bodyParser(),
    MiddlewareAuth.isAuthorized(T.Permission.superadmin),
    Validation.isShapeMiddleware({
      uuid: { extraCheck: VU.checkUuid },
    }),
    async (ctx) => {
      const { uuid } = ctx.request.body;
      ctx.body = await userAuthenticationService.detail(uuid);
    }
  );

  router.post(
    "/insert",
    bodyParser(),
    MiddlewareAuth.isAuthorized(T.Permission.superadmin),
    Validation.isShapeMiddleware(
      {
        type: { type: "number" },
        value: {},
        isEnabled: { type: "boolean" },
        user: { uuid: { extraCheck: VU.checkUuid } },
      },
      false
    ),
    async (ctx) => {
      const user: Pick<
        T.UserAuthentication,
        "type" | "value" | "isEnabled" | "user"
      > = ctx.request.body;
      ctx.body = await userAuthenticationService.insert(user);
    }
  );

  router.post(
    "/update",
    bodyParser(),
    MiddlewareAuth.isAuthorized(T.Permission.superadmin),
    Validation.isShapeMiddleware({
      uuid: { extraCheck: VU.checkUuid },
      type: { type: "number" },
      value: {},
      isEnabled: { type: "boolean" },
    }),
    async (ctx) => {
      const {
        uuid,
        ...data
      }: Pick<T.UserAuthentication, "uuid" | "type" | "value" | "isEnabled"> =
        ctx.request.body;
      ctx.body = await userAuthenticationService.update(uuid, data); // todo add instance!
    }
  );

  router.post(
    "/delete",
    bodyParser(),
    MiddlewareAuth.isAuthorized(T.Permission.superadmin),
    Validation.isShapeMiddleware({
      uuid: { extraCheck: VU.checkUuid },
    }),
    async (ctx) => {
      const { uuid } = ctx.request.body;

      ctx.request.body = ctx.body = await userAuthenticationService.delete(
        uuid
      );
    }
  );

  return router.routes();
};

export default UserAuthenticationService;
