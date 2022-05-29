import Koa from "koa";
import Router from "koa-router";

import { Response } from "../../middleware";

import NotificationService from "../../services/notification/abstract";

export default (Notification: NotificationService) => {
  const router: Router = new Router();

  router.all("/list", async (ctx: Koa.Context) => {
    const r = () => Notification.list();

    await Response.handleResponse(r, ctx);
  });

  return router.routes();
};
