import Rp from "request-promise-native";
import * as Utils from "./utils";
import SSOAbstract from "./abstract";

const urlAuthorize: string = "https://gitlab.com/oauth/authorize";
const urlToken: string = "https://gitlab.com/oauth/token";

export interface Profile {
  email: string;
}

export const getProfile = async (token: string): Promise<Profile> => {
  const headers = { Authorization: "Bearer " + token };
  const options = {
    url: "https://gitlab.com/api/v4/user",
    method: "GET",
    headers,
    json: true,
  };

  return await Rp(options);
};

export default class Gitlab extends SSOAbstract<Profile> {
  oAuthUrl = () => {
    const params: { [k: string]: string } = {
      client_id: this.client_id,
      redirect_uri: this.redirect_uri,
      response_type: "code",
      state: "sdfg",
      scope: "read_user",
    };
    return Utils.oAuthLink(urlAuthorize, params);
  };

  callback = async (code: string): Promise<string> => {
    const body = {
      code,
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type: "authorization_code",
      redirect_uri: this.redirect_uri,
    };

    return Utils.callback(urlToken, body);
  };

  getRefreshedToken = async () => "todo";

  getProfile = getProfile;
}
