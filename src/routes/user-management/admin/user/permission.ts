import Router from "koa-router";
import bodyParser from "koa-body";

import m from "../../../../middleware/auth";
import Validation, { Utils as VU } from "@nexys/validation";
import * as T from "../../type";
import { ObjectWithId } from "../../../../type";
import { Permissions } from "../../../../middleware/auth/type";

const PermissionRoutes = <
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
  Id
>(
  { permissionService }: T.Services,
  MiddlewareAuth: m<Profile, UserCache, Id>
) => {
  const router = new Router();

  router.post(
    "/list",
    bodyParser(),
    MiddlewareAuth.isAuthorized("admin"),
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
    MiddlewareAuth.isAuthorized("admin"),
    Validation.isShapeMiddleware({
      user: { uuid: { extraCheck: VU.checkUuid } },
      permission: { uuid: { extraCheck: VU.checkUuid } },
      assigned: { type: "boolean" },
    }),
    async (ctx) => {
      const {
        user,
        permission,
        assigned,
      }: {
        user: { uuid: Id };
        permission: { uuid: Id };
        assigned: boolean;
      } = ctx.request.body;

      if (assigned) {
        ctx.body = await permissionService.revokeFromUser(
          permission.uuid,
          user
        );
        return;
      }

      ctx.body = await permissionService.assignToUser2(permission.uuid, user);
    }
  );

  return router.routes();
};

export default PermissionRoutes;
