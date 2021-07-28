import Router from "koa-router";

import m from "../../../middleware/auth";
import * as T from "../type";
import { ObjectWithId } from "../../../type";
import { Permissions } from "../../../middleware/auth/type";

import Instance from "./instance";
import User from "./user";
import Permission from "./permission";
import Main from "./main";
import {
  PermissionService,
  UserService,
  InstanceService,
  UserAuthentication,
} from "../../../user-management";

const UserRoutes = <
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
  Id
>(
  {
    productService,
    userService,
    instanceService,
    permissionService,
    userAuthenticationService,
  }: {
    userService: UserService;
    instanceService: InstanceService;
    productService: T.productService;
    permissionService: PermissionService;
    userAuthenticationService: UserAuthentication;
  },
  MiddlewareAuth: m<Profile, UserCache, Id>
) => {
  const router = new Router();

  const instanceRoutes = Instance<Profile, UserCache, Id>(
    { instanceService },
    MiddlewareAuth
  );

  const userRoutes = User<Profile, UserCache, Id>(
    { userService, userAuthenticationService },
    MiddlewareAuth
  );

  const permissionRoutes = Permission<Profile, UserCache, Id>(
    { permissionService },
    MiddlewareAuth
  );

  const mainRoutes = Main<Profile, UserCache, Id>(
    { productService },
    MiddlewareAuth
  );

  router.use("/user", userRoutes);
  router.use("/instance", instanceRoutes);
  router.use("/permission", permissionRoutes);
  router.use(mainRoutes);

  return router.routes();
};

export default UserRoutes;
