export interface Services {
  instanceService: any;
  userService: any;
  passwordService: any;
  permissionService: any;
  userAuthenticationService: any;
}

//type Profile = Pick<CT.User, 'firstName' | 'lastName' | 'email' | 'lang'>;

// crud user management
export interface UserPermission {
  uuid: string;
  permissionInstance: { uuid: string } | PermissionInstance;
  user: { uuid: string } | User;
}

export interface UserAuthenticationType {
  id: number;
  name: string;
}

export interface UserStatus {
  id: number;
  name: string;
}

export interface UserAuthentication {
  uuid: string;
  value: string;
  isEnabled: boolean;
  type: { id: number } | UserAuthenticationType;
  user: { uuid: string } | User;
}

export interface PermissionInstance {
  uuid: string;
  instance: { uuid: string } | Instance;
  permission: { uuid: string } | Permission;
}

export interface Permission {
  uuid: string;
  name: string;
}

export interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  lang: string;
  status: { id: number } | UserStatus;
  logDateAdded: Date;
  instance: { uuid: string } | Instance;
}

export interface Instance {
  uuid: string;
  name: string;
  dateAdded: Date;
}
// end crud
