import Koa from "koa";
import Helmet from "koa-helmet";
import Logger from "koa-logger";
import { Subscription } from "./services/product";

export const init = (): Koa<Koa.DefaultState, Koa.DefaultContext> => {
  const app: Koa = new Koa();

  app.use(Logger());
  app.use(Helmet()); // NOTE: important security headers (https://github.com/venables/koa-helmet)

  return app;
};

export default init;
