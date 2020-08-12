import Rp from "request-promise-native";
import * as Utils from "./utils";
import SSOAbstract from "./abstract";

export interface Profile {
  id: number;
  login: string;
}

export const getProfile = async (token: string): Promise<Profile> => {
  // Promise<Profile> - does not pass build
  const headers = { Authorization: "Bearer " + token, "user-agent": "node.js" };
  const options = {
    url: "https://api.github.com/user",
    method: "GET",
    headers,
    json: true,
  };

  const r = await Rp(options);

  return { id: r.id, login: r.login };
};

const urlAuthorize: string = "https://github.com/login/oauth/authorize";
const urlToken: string = "https://github.com/login/oauth/access_token";

export default class Github extends SSOAbstract<Profile> {
  oAuthUrl = (state: string = "mystate"): string => {
    const params = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      state,
    };
    return Utils.oAuthLink(urlAuthorize, params);
  };

  callback = async (code: string): Promise<string> => {
    const body = {
      code,
      client_id: this.client_id,
      client_secret: this.client_secret,
      state: "sdf",
    };

    return Utils.callback(urlToken, body);
  };

  getRefreshedToken = async () => "todo";

  getProfile = getProfile;
}
