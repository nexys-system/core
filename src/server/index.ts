import App from "../app";
import Router from "koa-router";
import * as FetchR from "@nexys/fetchr";
import * as QueryService from "../query/service";

import fs from "fs";

import * as UserManagementService from "../user-management";
import * as UserManagementRoutes from "../routes/user-management";
import MiddlewareAuth from "../middleware/auth";
import Cache from "../cache/local";

// init fetchr
const model = JSON.parse(
  fs.readFileSync(__dirname + "/../../src/server/model.json", "utf-8")
);

FetchR.Model.Utils.addColumnsToModel(model);

const database: FetchR.Database.Type.Database = {
  username: "imvesters_user",
  host: "34.65.74.208",
  password: "lemanProperties",
  database: "imvesters",
  port: 3306,
};

const fetchR = new FetchR.default(database, model);
const qs = new QueryService.default(fetchR);
const secretKey = "mysecretkey";
const cache = new Cache();

const loginService = new UserManagementService.LoginService(qs, secretKey);
const userService = new UserManagementService.UserService(qs);
const passwordService = new UserManagementService.PasswordService(
  qs,
  secretKey
);

const middlewareAuth = new MiddlewareAuth(loginService, cache, secretKey);
const instance = {
  name: "Imvesters",
  uuid: "f12f49fa-7b3b-11eb-9846-42010aac0033",
};
const loginRoutes = UserManagementRoutes.Login(
  { loginService },
  middlewareAuth,
  instance
);

const profileRoutes = UserManagementRoutes.Profile(
  { userService, passwordService },
  middlewareAuth
);

const app = App();
const router = new Router();

router.use("/login", loginRoutes);
router.use("/profile", profileRoutes);

router.get("/fetch", async (ctx) => {
  //const r = await fetchR.query({ User: { take: 3 } });

  ctx.body = await qs.list("User", { take: 2 });
});

router.get("/", (ctx) => {
  ctx.body = { hello: "world" };
});

app.use(router.routes());

export const startApp = async (port: number) => {
  app.listen(port, () => console.log("Server started at port " + port));
};

startApp(3000);