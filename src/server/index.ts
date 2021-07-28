import App from "../lib/app";
import Router from "koa-router";
import * as FetchR from "@nexys/fetchr";
import * as QueryService from "../lib/query/service";

import * as UserManagementService from "../lib/user-management";
import * as UserManagementRoutes from "../lib/routes/user-management";
import MiddlewareAuth from "../lib/middleware/auth";
import Cache from "../lib/cache/local";

import * as Config from "./config";

const fetchR = new FetchR.default(Config.database, Config.model);
const qs = new QueryService.default(fetchR);

const cache = new Cache();

const loginService = new UserManagementService.LoginService(
  qs,
  Config.secretKey
);
const userService = new UserManagementService.UserService(qs);
const passwordService = new UserManagementService.PasswordService(
  qs,
  Config.secretKey
);

const middlewareAuth = new MiddlewareAuth(
  loginService,
  cache,
  Config.secretKey
);

const loginRoutes = UserManagementRoutes.Login(
  { loginService },
  middlewareAuth,
  Config.instance
);

const profileRoutes = UserManagementRoutes.Profile(
  { userService, passwordService },
  middlewareAuth
);

const app = App();
const router = new Router();

router.use("/auth", loginRoutes);
router.use("/profile", profileRoutes);

router.get("/", (ctx) => {
  ctx.body = { hello: "world" };
});

app.use(router.routes());

export const startApp = async (port: number) => {
  app.listen(port, () => console.log("Server started at port " + port));
};

startApp(3000);
