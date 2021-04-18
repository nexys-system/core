import Router from "koa-router";

import m from "../../../../middleware/auth";
import * as T from "../../type";
import { ObjectWithId } from "../../../../type";
import { Permissions } from "../../../../middleware/auth/type";

import MainRoutes from "./main";

import AuthenticationRoutes from "./authentication";

const UserRoutes = <
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
  Id
>(
  services: T.Services,
  MiddlewareAuth: m<Profile, UserCache, Id>
) => {
  const router = new Router();

  const mainRoutes = MainRoutes<Profile, UserCache, Id>(
    services,
    MiddlewareAuth
  );

  const authenticationRoutes = AuthenticationRoutes<Profile, UserCache, Id>(
    services,
    MiddlewareAuth
  );

  router.use("/authentication", authenticationRoutes);
  router.use(mainRoutes);

  return router.routes;
};

export default UserRoutes;
