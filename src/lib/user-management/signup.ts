import QueryService from "../query/abstract-service";
import * as CT from "./crud-type";
import * as T from "./type";
import AuthService from "./auth";
import InstanceService from "./instance";
import { Locale } from "../middleware/auth/type";

class SignupService {
  authService: AuthService;
  instanceService: InstanceService;
  secretKey: string;
  constructor(qs: QueryService, secretKey: string) {
    this.authService = new AuthService(qs, secretKey);
    this.instanceService = new InstanceService(qs);

    this.secretKey = secretKey;
  }

  insertInstanceWithPermissions = async (
    instanceName: string,
    permissions: CT.Permission[] = []
  ): Promise<{ uuid: string; permissions?: string[] }> => {
    const { uuid } = await this.instanceService.insert(instanceName);

    if (permissions.length === 0) {
      return { uuid };
    }

    const permissionsOut =
      await this.authService.userService.permissionService.assignToInstance(
        permissions,
        { uuid }
      );

    return { uuid, permissions: permissionsOut };
  };

  signup = async (
    instanceName: string,
    ghUsername: string,
    preProfile: Omit<T.Profile, "instance" | "id">,
    permissions: CT.Permission[] = [CT.Permission.app]
  ) => {
    try {
      await this.instanceService.exists(instanceName);
      throw Error("instance exists, signup aborted");
    } catch (err) {
      const { uuid } = await this.insertInstanceWithPermissions(
        instanceName,
        permissions
      );

      const profile: Omit<T.Profile, "id"> = {
        ...preProfile,
        instance: { uuid, name: instanceName },
      };
      const locale: Locale = { lang: "en", country: "US" };
      const authentication = {
        type: CT.AuthenticationType.github,
        value: ghUsername,
      };

      const signupOut = await this.authService.signup(
        profile,
        authentication,
        locale,
        permissions
      );

      await this.authService.userService.changeStatus(
        signupOut.uuid,
        T.Status.active
      );

      return { signupOut, instance: { uuid } };
    }
  };
}

export default SignupService;
