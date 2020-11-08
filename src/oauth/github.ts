import Rp from "request-promise-native";
import * as Utils from "./utils";
import AbstractOAuth from "./abstract";

export interface Profile {
  id: number;
  login: string;
}

const urlAuthorize: string = "https://github.com/login/oauth/authorize";
const urlToken: string = "https://github.com/login/oauth/access_token";

export default class Github extends AbstractOAuth<Profile> {
  callback = async (code: string): Promise<string> => {
    const body = {
      code,
      client_id: this.client_id,
      client_secret: this.client_secret,
    };

    return Utils.callback(urlToken, body);
  };

  getParams = (state?: string) => {
    const params = {
      client_id: this.client_id,
      redirect_uri: this.redirect_uri,
    };

    if (state) {
      return { state, ...params };
    }

    return params;
  };

  oAuthUrl = (state?: string): string => {
    const params = this.getParams(state);
    return Utils.oAuthLink(urlAuthorize, params);
  };

  getProfile = async (token: string): Promise<Profile> => {
    const headers = {
      Authorization: "Bearer " + token,
      "user-agent": "node.js",
    };
    const options = {
      url: "https://api.github.com/user",
      method: "GET",
      headers,
      json: true,
    };

    const r = await Rp(options);

    return { id: r.id, login: r.login };
  };
}
