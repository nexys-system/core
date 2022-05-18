import App from "../lib/app";
import Router from "koa-router";

import userManagementRoutes from "./routes/user-management";
import graphQLRoutes from "./routes/graphql";

const app = App();
const router = new Router();

router.use(userManagementRoutes);
router.use("/graphql", graphQLRoutes);

router.get("/", (ctx) => {
  ctx.body = { message: "nexys core server" };
});

app.use(router.routes());

export default app;
