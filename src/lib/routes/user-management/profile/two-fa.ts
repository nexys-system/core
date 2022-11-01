import Router from "koa-router";
import bodyParser from "koa-body";
import { Main as Validation } from "@nexys/validation";

import m from "../../../middleware/auth";

import { UserCacheDefault } from "../../../middleware/auth/type";

import { UserService } from "../../../user-management";

import Profile2FaService from "../../../user-management/two-fa";

const Profile2FaRoutes = <UserCache extends UserCacheDefault>(
  { userService }: { userService: UserService },
  MiddlewareAuth: m<UserCache>
) => {
  const router = new Router();

  const profile2FaService = new Profile2FaService(userService);

  router.all("/url", MiddlewareAuth.isAuthenticated(), async (ctx) => {
    const { name = "-" } = ctx.query;

    if (typeof name !== "string") {
      throw Error("could not get name param");
    }

    const url: string = profile2FaService.getUrl(name);

    ctx.body = { url };
  });

  router.all("/status", MiddlewareAuth.isAuthenticated(), async (ctx) => {
    const { id, instance } = ctx.state.profile;

    const isSet: boolean = await profile2FaService.getStatus(id, instance);

    ctx.body = { isSet };
  });

  router.all("/reset", MiddlewareAuth.isAuthenticated(), async (ctx) => {
    const { id } = ctx.state.profile;

    const r = await profile2FaService.reset(id);

    ctx.body = { r };
  });

  router.post(
    "/set",
    bodyParser(),
    MiddlewareAuth.isAuthenticated(),
    Validation.isShapeMiddleware({ code: { type: "number" }, secretUrl: {} }),
    async (ctx) => {
      const { id } = ctx.state.profile;
      const { code, secretUrl } = ctx.request.body;

      ctx.body = await profile2FaService.set(id, code, secretUrl);
    }
  );

  return router.routes();
};

export default Profile2FaRoutes;
