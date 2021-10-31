import QueryService from "./query/abstract-service-wdata";

import * as T from "./type";
import * as LT from "./middleware/auth/type";

import * as UserManagementService from "./user-management";
import Cache from "./cache/cache";

export interface Configuration {
  secretKey: string;
  appToken: string;
}

class ProductService<
  Profile extends T.ObjectWithId<Id>,
  UserCache extends LT.UserCacheDefault,
  Id = number,
  Permission = LT.Permission
> {
  configuration: Configuration;
  qs: QueryService;
  cache: Cache;
  public loginService: UserManagementService.LoginService;
  userService: UserManagementService.UserService;
  passwordService: UserManagementService.PasswordService;
  instanceService: UserManagementService.InstanceService;
  permissionService: UserManagementService.PermissionService;
  userAuthenticationService: UserManagementService.UserAuthentication;
  userTokenService: UserManagementService.UserToken;

  constructor(configuration: Configuration, qs: QueryService, cache: Cache) {
    this.configuration = configuration;
    this.qs = qs;
    this.cache = cache;

    this.loginService = new UserManagementService.LoginService(
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
  }
}

export default ProductService;
