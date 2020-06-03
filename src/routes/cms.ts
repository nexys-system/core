import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-body";
import * as Middleware from "../middleware";
import * as Schema from "../schema";

import { CMSService } from "./type";

const { handleResponse } = Middleware;

export default (CMS: CMSService) => {
  const router: Router = new Router();

  router.post(
    "/",
    bodyParser(),
    Schema.validateUuid,
    async (ctx: Koa.Context) => {
      const { uuid, lang = "en" } = ctx.state.validationResult;
      const r = () => CMS.get(uuid, lang);

      await handleResponse(r, ctx);
    }
  );

  return router.routes();
};
