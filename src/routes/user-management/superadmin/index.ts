import Router from "koa-router";

import m from "../../../middleware/auth";
import * as T from "../type";
import { ObjectWithId } from "../../../type";
import { Permissions } from "../../../middleware/auth/type";

import Instance from "./instance";
import User from "./user";
import Permission from "./permission";

const UserRoutes = <
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
  Id
>(
  services: T.Services,
  MiddlewareAuth: m<Profile, UserCache, Id>
) => {
  const router = new Router();

  const instanceRoutes = Instance<Profile, UserCache, Id>(
    services,
    MiddlewareAuth
  );

  const userRoutes = User<Profile, UserCache, Id>(services, MiddlewareAuth);

  const permissionRoutes = Permission<Profile, UserCache, Id>(
    services,
    MiddlewareAuth
  );

  router.use("/user", userRoutes);
  router.use("/instance", instanceRoutes);
  router.use("/permission", permissionRoutes);

  return router.routes();
};

export default UserRoutes;
