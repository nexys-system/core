import Cache from "@nexys/node-cache/dist/cache";
import QueryService from "./query/abstract-service-wdata";

import * as LT from "./middleware/auth/type";

import * as UserManagementService from "./user-management";
import MiddlewareAuth from "./middleware/auth";

export interface Configuration {
  secretKey: string;
  appToken: string;
}

class ProductService<
  UserCache extends LT.UserCacheDefault,
  Permission = LT.Permission
> {
  configuration: Configuration;
  qs: QueryService;
  cache: Cache;
  public authService: UserManagementService.AuthService;
  userService: UserManagementService.UserService;
  passwordService: UserManagementService.PasswordService;
  instanceService: UserManagementService.InstanceService;
  permissionService: UserManagementService.PermissionService;
  userAuthenticationService: UserManagementService.UserAuthentication;
  userTokenService: UserManagementService.UserToken;
  public middlewareAuth: MiddlewareAuth<UserCache, Permission>;

  constructor(
    configuration: Configuration,
    qs: QueryService,
    cache: Cache,
    authOptions?: Partial<LT.AuthOptions>
  ) {
    this.configuration = configuration;
    this.qs = qs;
    this.cache = cache;

    this.authService = new UserManagementService.AuthService(
      qs,
      configuration.secretKey
    );

    this.userService = new UserManagementService.UserService(qs);

    this.passwordService = new UserManagementService.PasswordService(
      qs,
      configuration.secretKey
    );

    this.instanceService = new UserManagementService.InstanceService(qs);

    this.permissionService = new UserManagementService.PermissionService(qs);

    this.userAuthenticationService =
      new UserManagementService.UserAuthentication(qs);

    this.userTokenService = new UserManagementService.UserToken(qs);

    this.middlewareAuth = new MiddlewareAuth(
      this.authService,
      cache,
      configuration.secretKey,
      authOptions
    );
  }
}

export default ProductService;
