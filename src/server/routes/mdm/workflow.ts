import Router from "koa-router";

import bodyParser from "koa-body";

import * as WorkflowService from "../../service/workflow";
import * as V from "@nexys/validation";

const router = new Router();

router.get("/detail", async (ctx) => {
  const { uuid, step = 1 } = ctx.request.query;

  if (!uuid || typeof uuid !== "string") {
    throw Error("uuid undefined");
  }

  ctx.body = await WorkflowService.detail(uuid, Number(step));
});

const shape: V.Type.Shape = {
  uuid: { extraCheck: V.Utils.checkUuid },
  company: { id: { type: "number", ceid: {} } },
};

router.post(
  "/update",
  bodyParser(),
  //V.Main.isShapeMiddleware(shape),
  async (ctx) => {
    console.log("fd");
    const { body } = ctx.request;

    const {
      uuid,
      company,
    }: { uuid: string; company: { id: number; ceid: string } } = body;

    ctx.body = await WorkflowService.update(uuid, company);
  }
);

const shapeUpdateDomain: V.Type.Shape = {
  uuid: { extraCheck: V.Utils.checkUuid },
  domain: {},
  addDomain: { type: "boolean" },
};

router.post(
  "/update/domain",
  bodyParser(),
  V.Main.isShapeMiddleware(shapeUpdateDomain),
  async (ctx) => {
    const { body } = ctx.request;
    const { uuid, domain, addDomain } = body;

    ctx.body = await WorkflowService.updateDomain(uuid, domain, addDomain);
  }
);

export default router.routes();
