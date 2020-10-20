import JWT from "jsonwebtoken";

const dummySecretKey = "mysecretkey";

const secretKey = process.env.SECRET || dummySecretKey;

if (dummySecretKey === secretKey) {
  console.warn(
    "secret key has not been set in env var, taking default - this should NEVER be the case on prod"
  );
}

export const sign = <A extends Object>(profile: A): string =>
  JWT.sign(profile, secretKey);

export const verify = <A extends Object>(token: string): { iat: number } & A =>
  JWT.verify(token, secretKey) as { iat: number } & A;
