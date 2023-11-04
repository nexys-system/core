import App from "../lib/app";
import Router from "@koa/router";

import graphQLRoutes from "./routes/graphql";

const app = App();
const router = new Router();

router.use("/graphql", graphQLRoutes);

router.get("/", (ctx) => {
  ctx.body = { message: "nexys core server" };
});

app.use(router.routes());

export default app;
