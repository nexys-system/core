import Router from "koa-router";

import m from "../../../middleware/auth";

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
  UserToken,
} from "../../../user-management";
import ProductContext from "../../../services/product/context";

const SuperadminRoutes = <
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
  Id
>(
  {
    productContext,
    userService,
    instanceService,
    permissionService,
    userAuthenticationService,
    userTokenService,
  }: {
    userService: UserService;
    instanceService: InstanceService;
    productContext: ProductContext;
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

  const contextRoutes = Main<Profile, UserCache, Id>(
    { productContext },
    MiddlewareAuth
  );

  router.use("/user", userRoutes);
  router.use("/instance", instanceRoutes);
  router.use("/permission", permissionRoutes);
  router.use("/context", contextRoutes);

  router.all("/", (ctx) => {
    ctx.body = { message: "superadmin" };
  });

  return router.routes();
};

export default SuperadminRoutes;
