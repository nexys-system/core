import Router from "koa-router";

import m from "../../../../middleware/auth";

import { UserCacheDefault } from "../../../../middleware/auth/type";

import InstanceRoutes from "./instance";
import UserRoutes from "./user";
import MainRoutes from "./main";
import { PermissionService } from "../../../../user-management";

const ProfileRoutes = <UserCache extends UserCacheDefault>(
  { permissionService }: { permissionService: PermissionService },
  MiddlewareAuth: m<UserCache>
) => {
  const instanceRoutes = InstanceRoutes<UserCache>(
    { permissionService },
    MiddlewareAuth
  );

  const userRoutes = UserRoutes<UserCache>(
    { permissionService },
    MiddlewareAuth
  );

  const mainRoutes = MainRoutes<UserCache>(
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
