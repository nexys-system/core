import Router from "koa-router";
import bodyParser from "koa-body";
import * as V from "@nexys/validation";

import m from "../../../middleware/auth";
import { Permissions } from "../../../middleware/auth/type";

import { ObjectWithId } from "../../../type";
import ProductContext from "../../../services/product/context";

const ProductService = <
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
  Id
>(
  { productContext }: { productContext: ProductContext },
  MiddlewareAuth: m<Profile, UserCache, Id>
) => {
  const router = new Router();

  router.all("/", MiddlewareAuth.isAuthorized("superadmin"), (ctx) => {
    ctx.body = { app: "superadmin" };
  });

  router.all("/request/list", async (ctx) => {
    ctx.body = await productContext.getRequests();
  });

  router.all("/request/detail", bodyParser(), V.Main.isUuid, async (ctx) => {
    const { uuid } = ctx.request.body;
    ctx.body = await productContext.getRequestDetail(uuid);
  });

  /*router.all(
    "/request/log/list",
    bodyParser(),
    V.Main.isShapeMiddleware({
      request: { uuid: { extraCheck: V.Utils.checkUuid } },
    }),
    async (ctx) => {
      const {
        request: { uuid },
      } = ctx.request.body;
      ctx.body = await productContext.getRequestsLog(uuid);
    }
  );*/

  router.all("/workflow/list", async (ctx) => {
    ctx.body = await productContext.getWorkflows();
  });

  router.all("/workflow/detail", bodyParser(), V.Main.isUuid, async (ctx) => {
    const { uuid } = ctx.request.body;
    ctx.body = await productContext.getWorkflowDetail(uuid);
  });

  router.all(
    "/workflow/state/list",
    bodyParser(),
    V.Main.isShapeMiddleware({
      workflow: { uuid: { extraCheck: V.Utils.checkUuid } },
    }),
    async (ctx) => {
      const {
        workflow: { uuid },
      } = ctx.request.body;
      ctx.body = await productContext.getWorkflowStates(uuid);
    }
  );

  /*router.all("/email/log/list", async (ctx) => {
    ctx.body = await productContext.getEmailLogs();
  });

  router.all("/email/log/detail", bodyParser(), V.Main.isUuid, async (ctx) => {
    const { uuid } = ctx.request.body;
    ctx.body = await productContext.getEmailLogDetail(uuid);
  });

  router.post(
    "/email/send",
    bodyParser(),
    V.Main.isShapeMiddleware({
      content: {},
      isHtml: { type: "boolean" },
      recipient: { extraCheck: V.Utils.emailCheck },
      title: {},
    }),
    async (ctx) => {
      ctx.body = await productService.sendEmail(ctx.request.body);
    }
  );*/

  return router.routes();
};

export default ProductService;
