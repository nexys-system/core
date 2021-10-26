import Koa from "koa";
import Router from "koa-router";

import I18nService from "../../services/i18n";

export default (I18n: I18nService) => {
  const router: Router = new Router();

  router.get("/serve", async (ctx: Koa.Context) => {
    const { lang } = ctx.request.query;

    const inputLang = lang;

    if (typeof inputLang !== "string") {
      ctx.status = 400;
      ctx.body = "lang must be given in query string";
      return;
    }

    try {
      ctx.body = await I18n.getFile(inputLang);
    } catch (error) {
      await I18n.saveAll();
      ctx.body = await I18n.getFile(inputLang);
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
