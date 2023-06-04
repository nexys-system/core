import Router from "koa-router";
import bodyParser from "koa-body";
import { Main as Validation, Utils as VU } from "@nexys/validation";

import m from "../../../../middleware/auth";
import { UserCacheDefault } from "../../../../middleware/auth/type";

import { PermissionService } from "../../../../user-management";
import { Permission } from "../../../../user-management/crud-type";

type Uuid = string;

const UserRoutes = <UserCache extends UserCacheDefault>(
  { permissionService }: { permissionService: PermissionService },
  MiddlewareAuth: m<UserCache>
) => {
  const router = new Router();

  router.post(
    "/list",
    bodyParser(),
    MiddlewareAuth.isAuthorized(Permission.superadmin),
    Validation.isShapeMiddleware({
      uuid: {
        extraCheck: VU.checkUuid,
      },
      instance: { uuid: { extraCheck: VU.checkUuid } },
    }),
    async (ctx) => {
      const { uuid, instance }: { uuid: string; instance: { uuid: string } } =
        ctx.request.body;
      ctx.body = await permissionService.listByUserAssigned({ uuid, instance });
    }
  );

  router.post(
    "/toggle",
    bodyParser(),
    MiddlewareAuth.isAuthorized(Permission.superadmin),
    Validation.isShapeMiddleware({
      user: { uuid: { extraCheck: VU.checkUuid } },
      permission: { type: "number" },
    }),
    async (ctx) => {
      const {
        user,
        permission,
      }: {
        user: { uuid: Uuid };
        permission: Permission;
      } = ctx.request.body;

      ctx.body = await permissionService.toggleFromUser(permission, user);
    }
  );

  return router.routes();
};

export default UserRoutes;
