import App from "../lib/app";
import Router from "koa-router";

import * as FetchR from "@nexys/fetchr";
import * as QueryService from "../lib/query/service";

import * as UserManagementService from "../lib/user-management";
import * as UserManagementRoutes from "../lib/routes/user-management";
import MiddlewareAuth from "../lib/middleware/auth";
import Cache from "../lib/cache/local";

import * as GraphQLService from "../lib/graph-ql";
import * as GraphQl from "./graph-ql";

import * as Config from "./config";

import * as OAuth from "@nexys/oauth";
import { AuthenticationType } from "../lib/user-management/crud-type";

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

const instanceService = new UserManagementService.InstanceService(qs);
const permissionService = new UserManagementService.PermissionService(qs);
const userAuthenticationService = new UserManagementService.UserAuthentication(
  qs
);
const userTokenService = new UserManagementService.UserToken(qs);
const productService = {};

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

const superadminRoutes = UserManagementRoutes.Superadmin(
  {
    userService,
    instanceService,
    permissionService,
    userAuthenticationService,
    userTokenService,
    productService,
  },
  middlewareAuth
);

const gh = new OAuth.Github(
  Config.ssoGithub.client_id,
  Config.ssoGithub.client_secret,
  "http://localhost:3000" + "/sso/github/redirect"
);

const gQLSchema = GraphQLService.SchemaFactory.getSchemaFromJSONDDL(
  Config.model,
  qs
);

const app = App();
const router = new Router();

router.use("/graphql", GraphQl.getGraphQLRoutes(gQLSchema, Config.appToken));

router.get("/sso/red", async (ctx) => {
  ctx.redirect(gh.oAuthUrl());
});

router.get("/sso/github/redirect", async (ctx) => {
  const { code } = ctx.query;
  const token = await gh.callback(code as string);
  const profile = await gh.getProfile(token);

  try {
    const l = await loginService.authenticate(
      profile.login,
      Config.instance,
      { type: AuthenticationType.github },
      { ip: "" }
    );

    await middlewareAuth.authOutput(
      ctx,
      l.profile as any,
      l.refreshToken,
      { permissions: l.permissions },
      l.locale,
      { secure: false }
    );
  } catch (err) {
    ctx.body = { message: err };
  }
});

router.use("/auth", loginRoutes);
router.use("/profile", profileRoutes);
router.use("/superadmin", superadminRoutes);

router.get("/", (ctx) => {
  ctx.body = { hello: "world" };
});

app.use(router.routes());

const startApp = async (port: number) => {
  app.listen(port, () => console.log("Server started at port " + port));
};

startApp(3001);
