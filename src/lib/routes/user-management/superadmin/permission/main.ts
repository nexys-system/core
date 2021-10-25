import Router from "koa-router";
import bodyParser from "koa-body";

import m from "../../../../middleware/auth";
import { UserCacheDefault } from "../../../../middleware/auth/type";

import { ObjectWithId } from "../../../../type";
import { PermissionService } from "../../../../user-management";
import { Permission } from "../../../../user-management/crud-type";

const PermissionRoutes = <
  Profile extends ObjectWithId<Id>,
  UserCache extends UserCacheDefault,
  Id
>(
  { permissionService }: { permissionService: PermissionService },
  MiddlewareAuth: m<Profile, UserCache, Id>
) => {
  const router = new Router();

  router.get(
    "/list",
    bodyParser(),
    MiddlewareAuth.isAuthorized(Permission.superadmin),
    async (ctx) => {
      ctx.body = permissionService.list;
    }
  );

  return router.routes();
};

export default PermissionRoutes;
