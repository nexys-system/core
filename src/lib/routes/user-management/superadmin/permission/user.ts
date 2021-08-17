import Router from "koa-router";
import bodyParser from "koa-body";
import { Uuid } from "@nexys/utils/dist/types";
import Validation, { Utils as VU } from "@nexys/validation";

import m from "../../../../middleware/auth";
import { Permissions } from "../../../../middleware/auth/type";

import { ObjectWithId } from "../../../../type";
import { PermissionService } from "../../../../user-management";
import { Permission } from "../../../../user-management/crud-type";

const UserRoutes = <
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
      assigned: { type: "boolean" },
    }),
    async (ctx) => {
      const {
        user,
        permission,
        assigned,
      }: {
        user: { uuid: Uuid };
        permission: Permission;
        assigned: boolean;
      } = ctx.request.body;

      if (assigned === false) {
        ctx.body = await permissionService.revokeFromUser(
          permission as any,
          user
        );
        return;
      }

      ctx.body = await permissionService.assignToUser2(permission as any, user);
    }
  );

  return router.routes();
};

export default UserRoutes;
