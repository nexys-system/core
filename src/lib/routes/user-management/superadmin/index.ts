import Router from "koa-router";

import m from "../../../middleware/auth";

import { UserCacheDefault } from "../../../middleware/auth/type";

import Instance from "./instance";
import User from "./user";
import Permission from "./permission";

import {
  PermissionService,
  UserService,
  InstanceService,
  UserAuthentication,
  UserToken,
} from "../../../user-management";

const SuperadminRoutes = <UserCache extends UserCacheDefault>(
  {
    userService,
    instanceService,
    permissionService,
    userAuthenticationService,
    userTokenService,
  }: {
    userService: UserService;
    instanceService: InstanceService;
    permissionService: PermissionService;
    userAuthenticationService: UserAuthentication;
    userTokenService: UserToken;
  },
  MiddlewareAuth: m<UserCache>
) => {
  const router = new Router();

  const instanceRoutes = Instance<UserCache>(
    { instanceService },
    MiddlewareAuth
  );

  const userRoutes = User<UserCache>(
    { userService, userAuthenticationService, userTokenService },
    MiddlewareAuth
  );

  const permissionRoutes = Permission<UserCache>(
    { permissionService },
    MiddlewareAuth
  );

  router.use("/user", userRoutes);
  router.use("/instance", instanceRoutes);
  router.use("/permission", permissionRoutes);

  router.all("/", (ctx) => {
    ctx.body = { message: "superadmin" };
  });

  return router.routes();
};

export default SuperadminRoutes;
