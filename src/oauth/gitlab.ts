import Rp from "request-promise-native";
import * as Utils from "./utils";
import AbstractOAuth from "./abstract";

export type Profile = any;

const urlAuthorize: string = "https://gitlab.com/oauth/authorize";
const urlToken: string = "https://gitlab.com/oauth/token";

export default class Gitlab extends AbstractOAuth<Profile> {
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

  oAuthUrl = () => {
    const params = {
      client_id: this.client_id,
      redirect_uri: this.client_secret,
    };

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
