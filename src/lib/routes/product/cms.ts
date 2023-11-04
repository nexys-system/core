import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-body";
import { Main as Validation, Utils as VU } from "@nexys/validation";

import { CMSService } from "./type";

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
      try {
        ctx.body = await CMS.get(uuid, lang);
      } catch (err) {
        ctx.status = 400;
        ctx.body = err;
      }
    }
  );

  return router.routes();
};
