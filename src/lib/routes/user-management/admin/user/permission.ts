import Router from "koa-router";
import bodyParser from "koa-body";

import m from "../../../../middleware/auth";
import { Main as Validation, Utils as VU } from "@nexys/validation";

import { ObjectWithId } from "../../../../type";
import { UserCacheDefault } from "../../../../middleware/auth/type";
import { PermissionService } from "../../../../user-management";
import { Permission } from "../../../../user-management/crud-type";

type Uuid = string;

const PermissionRoutes = <
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
    MiddlewareAuth.isAuthorized(Permission.admin),
    Validation.isShapeMiddleware({
      uuid: {
        extraCheck: VU.checkUuid,
      },
    }),
    async (ctx) => {
      const { uuid } = ctx.request.body;
      const { instance } = ctx.state.profile;
      ctx.body = await permissionService.listByUserAssigned({ uuid, instance });
    }
  );

  router.post(
    "/toggle",
    bodyParser(),
    MiddlewareAuth.isAuthorized(Permission.admin),
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
        permission: number;
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

export default PermissionRoutes;
