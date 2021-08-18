import App from "../lib/app";
import Router from "koa-router";

import userManagementRoutes from "./routes/user-management";
import graphQLRoutes from "./routes/graphql";
import ssoRoutes from "./routes/sso";
import crudRoutes from "./routes/crud";

const app = App();
const router = new Router();

router.use(userManagementRoutes);
router.use("/graphql", graphQLRoutes);
router.use("/sso", ssoRoutes);
router.use("/crud", crudRoutes);

router.get("/", (ctx) => {
  ctx.body = { hello: "world" };
});

app.use(router.routes());

const startApp = async (port: number) => {
  app.listen(port, () => console.log("Server started at port " + port));
};

startApp(3001);
