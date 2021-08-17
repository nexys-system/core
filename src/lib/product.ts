import QueryService from "./query/service";

import * as T from "./type";
import * as LT from "./middleware/auth/type";

import * as UserManagementService from "./user-management";
import MiddlewareAuth from "./middleware/auth";
import Cache from "./cache/cache";

import ProductContext from "./services/product/context";

interface Configuration {
  secretKey: string;
  host: string;
  appToken: string;
}

class ProductService<
  Profile extends T.ObjectWithId<Id>,
  UserCache extends LT.Permissions,
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
  productContext: ProductContext;
  public middlewareAuth: MiddlewareAuth<Profile, UserCache, Id, Permission>;

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
    this.productContext = new ProductContext(
      configuration.host,
      configuration.appToken
    );

    this.middlewareAuth = new MiddlewareAuth(
      this.loginService,
      cache,
      configuration.secretKey
    );
  }
}

export default ProductService;
