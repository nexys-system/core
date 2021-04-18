import Router from "koa-router";

import m from "../../../../middleware/auth";
import * as T from "../../type";
import { ObjectWithId } from "../../../../type";
import { Permissions } from "../../../../middleware/auth/type";

import InstanceRoutes from "./instance";
import UserRoutes from "./user";
import MainRoutes from "./main";

const ProfileRoutes = <
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
  Id
>(
  services: T.Services,
  MiddlewareAuth: m<Profile, UserCache, Id>
) => {
  const instanceRoutes = InstanceRoutes<Profile, UserCache, Id>(
    services,
    MiddlewareAuth
  );

  const userRoutes = UserRoutes<Profile, UserCache, Id>(
    services,
    MiddlewareAuth
  );

  const mainRoutes = MainRoutes<Profile, UserCache, Id>(
    services,
    MiddlewareAuth
  );

  const router = new Router();

  router.use("/instance", instanceRoutes);
  router.use("/user", userRoutes);
  router.use(mainRoutes);

  return router.routes();
};

export default ProfileRoutes;
