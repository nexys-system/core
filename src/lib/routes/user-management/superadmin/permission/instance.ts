import Router from "koa-router";
import bodyParser from "koa-body";
import { Uuid } from "@nexys/utils/dist/types";
import { Main as Validation, Utils as VU } from "@nexys/validation";

import m from "../../../../middleware/auth";
import { UserCacheDefault } from "../../../../middleware/auth/type";

import { ObjectWithId } from "../../../../type";
import { PermissionService } from "../../../../user-management";
import { Permission } from "../../../../user-management/crud-type";

const InstanceService = <
  Profile extends ObjectWithId<Id>,
  UserCache extends UserCacheDefault,
  Id
>(
  { permissionService }: { permissionService: PermissionService },
  MiddlewareAuth: m<Profile, UserCache, Id>
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
