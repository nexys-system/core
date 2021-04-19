import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-body";
import * as Middleware from "../../middleware";
import Validation, { Utils as VU } from "@nexys/validation";

import { CMSService } from "./type";

const { handleResponse } = Middleware;

export default (CMS: CMSService) => {
  const router: Router = new Router();

  router.post(
    "/",
    bodyParser(),
    Validation.isShapeMiddleware({ uuid: { extraCheck: VU.checkUuid } }),
    async (ctx: Koa.Context) => {
      const { uuid, lang = "en" } = ctx.state.validationResult;
      const r = () => CMS.get(uuid, lang);

      await handleResponse(r, ctx);
    }
  );

  return router.routes();
};
