import Router from "koa-router";
import bodyParser from "koa-body";
import { Uuid } from "@nexys/utils/dist/types";
import Validation, { Utils as VU } from "@nexys/validation";

import m from "../../../../middleware/auth";
import { Permissions } from "../../../../middleware/auth/type";

import { ObjectWithId } from "../../../../type";
import { PermissionService } from "../../../../user-management";
import { Permission } from "../../../../user-management/crud-type";

const InstanceService = <
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
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
      permission: { uuid: { extraCheck: VU.checkUuid } },
      assigned: { type: "boolean" },
    }),
    async (ctx) => {
      const {
        instance,
        permission,
        assigned,
      }: {
        instance: { uuid: Uuid };
        permission: { uuid: Uuid };
        assigned: boolean;
      } = ctx.request.body;

      if (assigned) {
        ctx.body = await permissionService.revokeFromInstance(
          [permission.uuid],
          instance
        );
        return;
      }

      ctx.body = await permissionService.assignToInstance(
        [permission.uuid],
        instance
      );
    }
  );

  return router.routes();
};

export default InstanceService;
