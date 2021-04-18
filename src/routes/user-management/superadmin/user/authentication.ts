import Router from "koa-router";
import bodyParser from "koa-body";
import Validation, { Utils as VU } from "@nexys/validation";

import m from "../../../../middleware/auth";
import { Permissions } from "../../../../middleware/auth/type";
import * as T from "../../type";
import { ObjectWithId } from "../../../../type";

const UserAuthenticationService = <
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
  Id
>(
  { userAuthenticationService }: T.Services,
  MiddlewareAuth: m<Profile, UserCache, Id>
) => {
  const router = new Router();

  router.post(
    "/list",
    bodyParser(),
    MiddlewareAuth.isAuthorized("superadmin"),
    Validation.isShapeMiddleware({ uuid: { extraCheck: VU.checkUuid } }),
    async (ctx) => {
      const { uuid } = ctx.request.body;
      ctx.body = await userAuthenticationService.list({ uuid });
    }
  );

  router.post(
    "/detail",
    bodyParser(),
    MiddlewareAuth.isAuthorized("superadmin"),
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
    MiddlewareAuth.isAuthorized("superadmin"),
    Validation.isShapeMiddleware(
      {
        type: { id: { type: "number" } },
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
    MiddlewareAuth.isAuthorized("superadmin"),
    Validation.isShapeMiddleware({
      uuid: { extraCheck: VU.checkUuid },
      type: { id: { type: "number" } },
      value: {},
      isEnabled: { type: "boolean" },
    }),
    async (ctx) => {
      const {
        uuid,
        ...data
      }: Pick<
        T.UserAuthentication,
        "uuid" | "type" | "value" | "isEnabled"
      > = ctx.request.body;
      ctx.body = await userAuthenticationService.update(uuid, data); // todo add instance!
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

      ctx.request.body = ctx.body = await userAuthenticationService.delete(
        uuid
      );
    }
  );

  return router.routes;
};

export default UserAuthenticationService;
