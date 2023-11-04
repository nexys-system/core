import Router from "@koa/router";
import Cms from "./cms";
import I18n from "./i18n";
import Notification from "./notification";
import Meta from "./meta";
import Email from "./email";
import * as Type from "./type";

export { Cms, I18n, Notification, Type };

export default (productService: Type.ProductService) => {
  const router: Router = new Router();

  router.use("/cms", Cms(productService.CMS));
  router.use("/i18n", I18n(productService.I18n));
  router.use("/notification", Notification(productService.Notification));
  router.use("/email", Email(productService.Email));
  router.use("/meta", Meta());

  return router.routes();
};
