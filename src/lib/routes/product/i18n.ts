import Koa from "koa";
import Router from "koa-router";

import I18nService from "../../services/i18n";

export default (I18n: I18nService) => {
  const router: Router = new Router();

  router.get("/serve", async (ctx: Koa.Context) => {
    const { locale } = ctx.request.query;

    if (typeof locale !== "string") {
      throw Error("locale is not of type string");
    }

    try {
      ctx.body = await I18n.getFile(locale);
    } catch (error) {
      await I18n.saveAll();
      ctx.body = await I18n.getFile(locale);
    }
  });

  router.get("/refresh", async (ctx) => {
    await I18n.saveAll();
    ctx.body = { message: "Translations refreshed successfully" };
    ctx.status = 200;
  });

  router.get("/languages", async (ctx) => {
    ctx.body = I18n.languages;
  });

  return router.routes();
};
