import Router from "koa-router";
import bodyParser from "koa-body";

import { Main as Validation, Utils as VU } from "@nexys/validation";

import m from "../../../../middleware/auth";
import { UserCacheDefault } from "../../../../middleware/auth/type";

import { PermissionService } from "../../../../user-management";
import { Permission } from "../../../../user-management/crud-type";

type Uuid = string;

const InstanceService = <UserCache extends UserCacheDefault>(
  { permissionService }: { permissionService: PermissionService },
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
      ctx.body = await permissionService.listByInstanceAssigned({ uuid });
    }
  );

  router.post(
    "/toggle",
    bodyParser(),
    MiddlewareAuth.isAuthorized(Permission.superadmin),
    Validation.isShapeMiddleware({
      instance: { uuid: { extraCheck: VU.checkUuid } },
      permission: { type: "number" },
    }),
    async (ctx) => {
      const {
        instance,
        permission,
      }: {
        instance: { uuid: Uuid };
        permission: Permission;
      } = ctx.request.body;

      ctx.body = await permissionService.toggleFromInstance(
        [permission],
        instance
      );
    }
  );

  return router.routes();
};

export default InstanceService;
