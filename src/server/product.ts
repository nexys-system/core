import * as FetchR from "@nexys/fetchr";
import * as QueryService from "../lib/query/service";

import * as UserManagementService from "../lib/user-management";
import MiddlewareAuth from "../lib/middleware/auth";
import Cache from "../lib/cache/local";

import * as Config from "./config";

import ProductContext from "../lib/services/product/context";

const fetchR = new FetchR.default(Config.database, Config.model);
export const qs = new QueryService.default(fetchR);

export const cache = new Cache();

export const loginService = new UserManagementService.LoginService(
  qs,
  Config.secretKey
);
export const userService = new UserManagementService.UserService(qs);
export const passwordService = new UserManagementService.PasswordService(
  qs,
  Config.secretKey
);

export const instanceService = new UserManagementService.InstanceService(qs);
export const permissionService = new UserManagementService.PermissionService(
  qs
);
export const userAuthenticationService =
  new UserManagementService.UserAuthentication(qs);
export const userTokenService = new UserManagementService.UserToken(qs);
export const productContext = new ProductContext(Config.host, Config.appToken);

export const middlewareAuth = new MiddlewareAuth(
  loginService,
  cache,
  Config.secretKey
);
