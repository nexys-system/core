import Router from "koa-router";

import * as Config from "../config";

import * as WF from "../../nexys/workflow";

const instance = { uuid: "2c5d0535-26ab-11e9-9284-fa163e41f33d" };

const router = new Router();

router.get("/wf", async (ctx) => {
  const w = await WF.fetch({ instance });
  ctx.body = w;
});

export default router.routes();
