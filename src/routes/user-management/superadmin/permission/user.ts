import Router from "koa-router";
import bodyParser from "koa-body";
import { Uuid } from "@nexys/utils/dist/types";
import Validation, { Utils as VU } from "@nexys/validation";

import m from "../../../../middleware/auth";
import { Permissions } from "../../../../middleware/auth/type";
import * as T from "../../type";
import { ObjectWithId } from "../../../../type";

const UserService = <
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
    MiddlewareAuth.isAuthorized("superadmin"),
    Validation.isShapeMiddleware({
      uuid: {
        extraCheck: VU.checkUuid,
      },
      instance: { uuid: { extraCheck: VU.checkUuid } },
    }),
    async (ctx) => {
      const { uuid, instance } = ctx.request.body;
      ctx.body = await permissionService.listByUserAssigned({ uuid, instance });
    }
  );

  router.post(
    "/toggle",
    bodyParser(),
    MiddlewareAuth.isAuthorized("superadmin"),
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
        user: { uuid: Uuid };
        permission: { uuid: Uuid };
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

export default UserService;
