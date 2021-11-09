import Koa from "koa";
import Router from "koa-router";

import I18nService from "../../services/i18n";

export default (I18n: I18nService) => {
  const router: Router = new Router();

  router.get("/serve", async (ctx: Koa.Context) => {
    const { lang } = ctx.request.query;

    if (typeof lang !== "string") {
      ctx.status = 400;
      ctx.body = "lang must be given in query string";
      return;
    }

    try {
      ctx.body = await I18n.getFile(lang);
    } catch (error) {
      console.log('I18n: initializing, saving files locally');
      const langs = await I18n.saveAll();
      console.log('I18n: the following langs were saved and can now be consumed by the application: ' + JSON.stringify(langs));
      ctx.body = await I18n.getFile(lang);
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
