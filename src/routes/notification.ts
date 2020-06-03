import Koa from "koa";
import Router from "koa-router";

import * as Middleware from "../middleware";

import { NotificationService } from "./type";

const { handleResponse } = Middleware;

export default (Notification: NotificationService) => {
  const router: Router = new Router();
  router.all("/list", async (ctx: Koa.Context) => {
    const r = () => Notification.list();

    await handleResponse(r, ctx);
  });

  return router.routes();
};
