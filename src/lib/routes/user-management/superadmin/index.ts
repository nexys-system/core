import Router from "koa-router";

import m from "../../../middleware/auth";

import { ObjectWithId } from "../../../type";
import { UserCacheDefault } from "../../../middleware/auth/type";

import Instance from "./instance";
import User from "./user";
import Permission from "./permission";
import Main from "./main";
import {
  PermissionService,
  UserService,
  InstanceService,
  UserAuthentication,
  UserToken,
} from "../../../user-management";

const SuperadminRoutes = <
  Profile extends ObjectWithId<Id>,
  UserCache extends UserCacheDefault,
  Id
>(
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
  MiddlewareAuth: m<Profile, UserCache, Id>
) => {
  const router = new Router();

  const instanceRoutes = Instance<Profile, UserCache, Id>(
    { instanceService },
    MiddlewareAuth
  );

  const userRoutes = User<Profile, UserCache, Id>(
    { userService, userAuthenticationService, userTokenService },
    MiddlewareAuth
  );

  const permissionRoutes = Permission<Profile, UserCache, Id>(
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
