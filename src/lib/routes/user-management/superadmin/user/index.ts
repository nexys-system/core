import Router from "koa-router";

import m from "../../../../middleware/auth";

import { UserCacheDefault } from "../../../../middleware/auth/type";

import MainRoutes from "./main";

import AuthenticationRoutes from "./authentication";
import TokenRoutes from "./token";
import {
  UserAuthentication,
  UserService,
  UserToken,
} from "../../../../user-management";

const UserRoutes = <UserCache extends UserCacheDefault>(
  {
    userService,
    userAuthenticationService,
    userTokenService,
  }: {
    userService: UserService;
    userAuthenticationService: UserAuthentication;
    userTokenService: UserToken;
  },
  MiddlewareAuth: m<UserCache>
) => {
  const router = new Router();

  const mainRoutes = MainRoutes<UserCache>({ userService }, MiddlewareAuth);

  const authenticationRoutes = AuthenticationRoutes<UserCache>(
    { userAuthenticationService },
    MiddlewareAuth
  );

  const tokenRoutes = TokenRoutes<UserCache>(
    { userTokenService },
    MiddlewareAuth
  );

  router.use("/token", tokenRoutes);
  router.use("/authentication", authenticationRoutes);
  router.use(mainRoutes);

  return router.routes();
};

export default UserRoutes;
