import Koa from "koa";
import Router from "koa-router";

import NotificationService from "../../services/notification/abstract";

export default (Notification: NotificationService) => {
  const router: Router = new Router();

  router.all("/list", async (ctx: Koa.Context) => {
    try {
      ctx.body = await Notification.list();
    } catch (err) {
      ctx.status = 400;
      ctx.body = err;
    }
  });

  return router.routes();
};
