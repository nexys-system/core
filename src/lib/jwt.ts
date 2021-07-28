import JWT from "jsonwebtoken";

export default class JWTClass {
  secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  read = (token: string) => JWT.decode(token);

  sign = <A extends Object>(profile: A): string =>
    JWT.sign(profile, this.secret);

  verify = <A extends Object>(token: string): { iat: number } & A =>
    JWT.verify(token, this.secret) as { iat: number } & A;
}
