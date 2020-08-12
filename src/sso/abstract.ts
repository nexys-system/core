export default abstract class SSOService<AProfile> {
  client_id: string;
  client_secret: string;
  scopes: string[];
  redirect_uri: string;

  constructor(
    client_id: string,
    client_secret: string,
    redirect_uri: string,
    scopes: string[]
  ) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.scopes = scopes;
    this.redirect_uri = redirect_uri;
  }

  abstract oAuthUrl(state?: string): string;

  abstract callback(code: string): Promise<string>;

  abstract getRefreshedToken(refresh_token: string): Promise<string>;

  abstract getProfile(accessToken: string): Promise<AProfile>;
}
