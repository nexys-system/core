import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-body";
import * as Middleware from "../../middleware";
import { Main as Validation, Utils as VU } from "@nexys/validation";

import { CMSService } from "./type";

const { Response } = Middleware;

export default (CMS: CMSService) => {
  const router: Router = new Router();

  router.post(
    "/",
    bodyParser(),
    Validation.isShapeMiddleware({
      uuid: { extraCheck: VU.checkUuid },
      isHtml: { type: "boolean", optional: true },
      lang: { optional: true },
    }),
    async (ctx: Koa.Context) => {
      const { uuid, lang = "en" } = ctx.request.body;
      const r = () => CMS.get(uuid, lang);

      await Response.handleResponse(r, ctx);
    }
  );

  return router.routes();
};
