import Router from "koa-router";

import * as UserManagementRoutes from "../../lib/routes/user-management";
import * as Config from "../config";

import {
  middlewareAuth,
  productContext,
  userTokenService,
  userAuthenticationService,
  permissionService,
  instanceService,
  passwordService,
  userService,
  loginService,
} from "../product";

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
    productContext,
  },
  middlewareAuth
);

const router = new Router();

router.use("/auth", loginRoutes);
router.use("/profile", profileRoutes);
router.use("/superadmin", superadminRoutes);

export default router.routes();
