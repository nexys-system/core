import Router from "koa-router";
import bodyParser from "koa-body";
import { Main as Validation } from "@nexys/validation";

import m from "../../../middleware/auth";
import { UserCacheDefault } from "../../../middleware/auth/type";

import { UserTokenService } from "../../../user-management";
import { TokenType } from "../../../user-management/crud-type";

import { getIPandUserAgent } from "../auth/utils";

const ProfileTokenRoutes = <UserCache extends UserCacheDefault>(
  {
    userTokenService,
  }: {
    userTokenService: UserTokenService;
  },
  MiddlewareAuth: m<UserCache>
) => {
  const router = new Router();

  router.post(
    "/create",
    bodyParser(),
    MiddlewareAuth.isAuthenticated(),
    async (ctx) => {
      const { id } = ctx.state.profile;
      const ipAndUserAgent = getIPandUserAgent(ctx);

      const result = await userTokenService.create(
        id,
        TokenType.apiToken,
        ipAndUserAgent
      );

      ctx.body = { result };
    }
  );

  router.post(
    "/revoke",
    bodyParser(),
    MiddlewareAuth.isAuthenticated(),
    Validation.isUuid,
    async (ctx) => {
      const { uuid } = ctx.request.body;

      ctx.body = await userTokenService.delete(uuid);
    }
  );

  return router.routes();
};

export default ProfileTokenRoutes;
