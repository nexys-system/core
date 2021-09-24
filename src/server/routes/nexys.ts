import Router from "koa-router";

import * as WF from "../../nexys/workflow";
import * as Req from "../../nexys/request";
import { saveContent } from "../../nexys/context";

const instance = { uuid: "2c5d0535-26ab-11e9-9284-fa163e41f33d" };

const router = new Router();

router.get("/wf", async (ctx) => {
  const w = await WF.fetch({ instance });
  await saveContent(w, "workflow");
  ctx.body = w;
});

router.get("/request", async (ctx) => {
  const w = await Req.fetch({ instance });
  await saveContent(w, "request");
  ctx.body = w;
});

export default router.routes();
