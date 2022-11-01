import { UserService } from "./";
import { generateSecret, toQRString, verifyTOTP } from "@nexys/timebasedotp";
import { secretFromUrl } from "@nexys/timebasedotp/dist/utils";
import { User } from "./crud-type";

class Profile2FaService {
  userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  getUrl = (name: string): string => toQRString(name, generateSecret());

  getStatus = async (
    userId: string,
    instance: {
      uuid: string;
    }
  ): Promise<boolean> => {
    const r = await this.userService.detail(userId, instance);

    const isSet: boolean = !!r.faSecret;

    return isSet;
  };

  set = async (
    userId: string,
    code: number,
    secretUrl: string
  ): Promise<{ verification: boolean; r?: { success: boolean } }> => {
    const faSecret = secretFromUrl(secretUrl);

    const verification: boolean = verifyTOTP(code, faSecret);

    if (verification === false) {
      return { verification };
    }

    const r = await this.userService.update(userId, { faSecret });

    return { verification, r };
  };

  reset = async (userId: string): Promise<{ success: boolean }> => {
    const data: Partial<User> = { faSecret: null } as any as Partial<User>;
    return this.userService.update(userId, data);
  };
}

export default Profile2FaService;
