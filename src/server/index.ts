import App from "../lib/app";
import Router from "koa-router";

import userManagementRoutes from "./routes/user-management";
import graphQLRoutes from "./routes/graphql";

import * as Product from "./product";

const app = App();
const router = new Router();

router.get("/email", async (ctx) => {
  await Product.email.findAndSend(
    "8f6a163e-bf8c-11ea-90f0-42010aac0009",
    "johan@nexys.ch",
    { link: "http://hgfds.com" }
  );
  ctx.body = { hello: "fd" };
});

router.use(userManagementRoutes);
router.use("/graphql", graphQLRoutes);

router.get("/", (ctx) => {
  ctx.body = { hello: "world" };
});

app.use(router.routes());

const startApp = async (port: number) => {
  app.listen(port, () => console.log("Server started at port " + port));
};

const port = process.env.PORT ? Number(process.env.PORT) : 3001;

startApp(port);
