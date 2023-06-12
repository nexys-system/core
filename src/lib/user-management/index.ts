import AuthService from "./auth";
import PasswordService from "./password";
import PermissionService from "./permission";
import UserService from "./user";
import UserAuthentication from "./user/authentication";
import UserTokenService from "./user/token";
import InstanceService from "./instance";
import SignupService from "./signup";

export * as Types from "./type";
export * as CrudTypes from "./crud-type";

export {
  AuthService,
  PasswordService,
  PermissionService,
  UserService,
  UserAuthentication,
  UserTokenService,
  InstanceService,
  SignupService,
};
