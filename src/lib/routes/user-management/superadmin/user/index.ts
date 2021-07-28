import Router from "koa-router";

import m from "../../../../middleware/auth";
import { ObjectWithId } from "../../../../type";
import { Permissions } from "../../../../middleware/auth/type";

import MainRoutes from "./main";

import AuthenticationRoutes from "./authentication";
import { UserAuthentication, UserService } from "../../../../user-management";

const UserRoutes = <
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
  Id
>(
  {
    userService,
    userAuthenticationService,
  }: {
    userService: UserService;
    userAuthenticationService: UserAuthentication;
  },
  MiddlewareAuth: m<Profile, UserCache, Id>
) => {
  const router = new Router();

  const mainRoutes = MainRoutes<Profile, UserCache, Id>(
    { userService },
    MiddlewareAuth
  );

  const authenticationRoutes = AuthenticationRoutes<Profile, UserCache, Id>(
    { userAuthenticationService },
    MiddlewareAuth
  );

  router.use("/authentication", authenticationRoutes);
  router.use(mainRoutes);

  return router.routes();
};

export default UserRoutes;
