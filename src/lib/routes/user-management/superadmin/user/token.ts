import Router from "koa-router";
import bodyParser from "koa-body";
import { Main as Validation, Utils as VU } from "@nexys/validation";

import m from "../../../../middleware/auth";
import { UserCacheDefault } from "../../../../middleware/auth/type";

import { UserToken } from "../../../../user-management";
import { Permission } from "../../../../user-management/crud-type";

const UserTokenService = <UserCache extends UserCacheDefault>(
  { userTokenService }: { userTokenService: UserToken },
  MiddlewareAuth: m<UserCache>
) => {
  const router = new Router();

  router.post(
    "/list",
    bodyParser(),
    MiddlewareAuth.isAuthorized(Permission.superadmin),
    Validation.isShapeMiddleware({ uuid: { extraCheck: VU.checkUuid } }),
    async (ctx) => {
      const { uuid } = ctx.request.body;
      ctx.body = await userTokenService.list({ uuid });
    }
  );

  router.post(
    "/delete",
    bodyParser(),
    MiddlewareAuth.isAuthorized(Permission.superadmin),
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
