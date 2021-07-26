import Router from "koa-router";

import m from "../../../../middleware/auth";
import { ObjectWithId } from "../../../../type";
import { Permissions } from "../../../../middleware/auth/type";

import InstanceRoutes from "./instance";
import UserRoutes from "./user";
import MainRoutes from "./main";
import { PermissionService } from "../../../../user-management";

const ProfileRoutes = <
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
  Id
>(
  { permissionService }: { permissionService: PermissionService },
  MiddlewareAuth: m<Profile, UserCache, Id>
) => {
  const instanceRoutes = InstanceRoutes<Profile, UserCache, Id>(
    { permissionService },
    MiddlewareAuth
  );

  const userRoutes = UserRoutes<Profile, UserCache, Id>(
    { permissionService },
    MiddlewareAuth
  );

  const mainRoutes = MainRoutes<Profile, UserCache, Id>(
    { permissionService },
    MiddlewareAuth
  );

  const router = new Router();

  router.use("/instance", instanceRoutes);
  router.use("/user", userRoutes);
  router.use(mainRoutes);

  return router.routes();
};

export default ProfileRoutes;
