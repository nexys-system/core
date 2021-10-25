import Router from "koa-router";

import m from "../../../../middleware/auth";

import { ObjectWithId } from "../../../../type";

import Authentication from "./authentication";
import Permission from "./permission";
import Main from "./main";
import {
  PermissionService,
  UserService,
  UserAuthentication,
} from "../../../../user-management";
import { UserCacheDefault } from "../../../../middleware/auth/type";

const UserRoutes = <
  Profile extends ObjectWithId<Id>,
  UserCache extends UserCacheDefault,
  Id
>(
  {
    userService,
    permissionService,
    userAuthenticationService,
  }: {
    userService: UserService;
    permissionService: PermissionService;
    userAuthenticationService: UserAuthentication;
  },
  MiddlewareAuth: m<Profile, UserCache, Id>
) => {
  const router = new Router();

  const authenticationRoutes = Authentication<Profile, UserCache, Id>(
    { userAuthenticationService },
    MiddlewareAuth
  );

  const permissionRoutes = Permission<Profile, UserCache, Id>(
    { permissionService },
    MiddlewareAuth
  );

  const mainRoutes = Main<Profile, UserCache, Id>(
    { userService },
    MiddlewareAuth
  );

  router.use("/authentication", authenticationRoutes);
  router.use("/permission", permissionRoutes);
  router.use(mainRoutes);

  return router.routes();
};

export default UserRoutes;
