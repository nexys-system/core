import App from "../lib/app";
import Router from "koa-router";

import userManagementRoutes from "./routes/user-management";
import graphQlRoutes from "./routes/graphql";
import ssoRoutes from "./routes/sso";

const app = App();
const router = new Router();

router.use(userManagementRoutes);
router.use("/graphql", graphQlRoutes);
router.use("/sso", ssoRoutes);

router.get("/", (ctx) => {
  ctx.body = { hello: "world" };
});

app.use(router.routes());

const startApp = async (port: number) => {
  app.listen(port, () => console.log("Server started at port " + port));
};

startApp(3001);
