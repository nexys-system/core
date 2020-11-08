export default abstract class OAuth2<Profile> {
  client_id: string;
  client_secret: string;
  redirect_uri: string;

  constructor(client_id: string, client_secret: string, redirect_uri: string) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.redirect_uri = redirect_uri;
  }

  abstract callback(code: string): Promise<string>;

  abstract oAuthUrl(state?: string, scopes?: string[]): string;

  abstract getProfile(token: string): Promise<Profile>;
}
