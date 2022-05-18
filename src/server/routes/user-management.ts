import Router from "koa-router";

import * as UserManagementRoutes from "../../lib/routes/user-management";
import * as Config from "../config";

import P from "../product";

const loginRoutes = UserManagementRoutes.Auth(
  { authService: P.authService },
  P.middlewareAuth,
  Config.instance
);

const profileRoutes = UserManagementRoutes.Profile(
  { userService: P.userService, passwordService: P.passwordService },
  P.middlewareAuth
);

const superadminRoutes = UserManagementRoutes.Superadmin(P, P.middlewareAuth);

const router = new Router();

router.use("/auth", loginRoutes);
router.use("/profile", profileRoutes);
router.use("/superadmin", superadminRoutes);

export default router.routes();
