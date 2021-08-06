import Router from "koa-router";
import bodyParser from "koa-body";
import Validation, { Utils as VU } from "@nexys/validation";

import m from "../../../../middleware/auth";
import { Permissions } from "../../../../middleware/auth/type";

import { ObjectWithId } from "../../../../type";
import { UserToken } from "../../../../user-management";

const UserTokenService = <
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
  Id
>(
  { userTokenService }: { userTokenService: UserToken },
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
      ctx.body = await userTokenService.list({ uuid });
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

      ctx.request.body = ctx.body = await userTokenService.delete(uuid);
    }
  );

  return router.routes();
};

export default UserTokenService;