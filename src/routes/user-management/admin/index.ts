import Router from "koa-router";

import m from "../../../middleware/auth";
import * as T from "../type";
import { ObjectWithId } from "../../../type";
import { Permissions } from "../../../middleware/auth/type";

import UserRoutes from "./user";

const AdminRoutes = <
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
  Id
>(
  service: T.Services,
  MiddlewareAuth: m<Profile, UserCache, Id>
) => {
  const router = new Router();

  const userRoutes = UserRoutes<Profile, UserCache, Id>(
    service,
    MiddlewareAuth
  );

  router.use("/user", userRoutes);

  return router.routes();
};

export default AdminRoutes;
