import Koa from "koa";

export const init = (): Koa<Koa.DefaultState, Koa.DefaultContext> => {
  const app: Koa = new Koa();

  return app;
};

export default init;
