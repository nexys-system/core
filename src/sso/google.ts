/**
 * connects to google api and gp through oauth2 authentication
 */
import rp from "request-promise-native";
import * as Utils from "./utils";
import SSOAbstract from "./abstract";

export interface GoogleProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  link: string;
  picture: string;
  gender: string;
  locale: string;
  hd: string;
}

export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const apiHost = "https://www.googleapis.com";

export const getProfile = async (accessToken: string): Promise<Profile> => {
  const url: string = apiHost + "/oauth2/v1/userinfo?alt=json";

  const options: rp.RequestPromiseOptions = {
    headers: Utils.oAuthHeaders(accessToken),
    method: "GET",
    json: true,
  };

  try {
    const res: GoogleProfile = await rp(url, options);

    return {
      id: res.id,
      email: res.email,
      firstName: res.family_name,
      lastName: res.given_name,
    };
  } catch (err) {
    console.log("error refresh");
    return err;
  }
};

export default class Google extends SSOAbstract<Profile> {
  oAuthUrl = (state: string = "myuniquestatetoavoidCSRF"): string => {
    const params = {
      state,
      redirect_uri: this.redirect_uri,
      client_id: this.client_id,
      scope: this.scopes.join(" "),
      response_type: "code",
      prompt: "consent",
      access_type: "offline", // this allows us to get the refresh token
      include_granted_scopes: true,
    };

    const urlAuthorize: string = "https://accounts.google.com/o/oauth2/v2/auth";
    return Utils.oAuthLink(urlAuthorize, params);
  };

  callback = async (code: string): Promise<string> => {
    const url = apiHost + "/oauth2/v4/token";

    const body = {
      code,
      client_id: this.client_id,
      client_secret: this.client_secret,
      redirect_uri: this.redirect_uri,
      grant_type: "authorization_code",
    };

    return Utils.callback(url, body);
  };

  getRefreshedToken = async (refresh_token: string) => {
    const url = apiHost + "/oauth2/v4/token";

    const body = {
      refresh_token,
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type: "refresh_token",
    };

    return Utils.callback(url, body);
  };

  getProfile = getProfile;
}
