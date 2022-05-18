import * as FetchR from "@nexys/fetchr";
import dotenv from "dotenv";

import JWT from "jsonwebtoken";

import * as U from "./utils";
import { get } from "../../lib/context";
import { AppTokenDecoded } from "../../lib/context/type";

dotenv.config();

// init fetchr
export const database: FetchR.Database.Connection.ConnectionOptions = {
  user: process.env.DATABASE_USER || "",
  host: process.env.DATABASE_HOST || "",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "",
  port: 3306,
};

export const instance = {
  name: process.env.INSTANCE_NAME || "",
  uuid: process.env.INSTANCE_UUID || "",
};

export const ssoGithub = {
  client_id: "6763ce57887aaf5a2197",
  client_secret: "7d34944b9f420a950eb52a9447627702bc1685fe",
};

const errorPrefix = "[CONFIGURATION] ";

if (process.env.SECRET === undefined) {
  throw Error(errorPrefix + "SECRET is undefined");
}

export const secretKey = process.env.SECRET; //

if (secretKey.length !== 32) {
  throw Error(errorPrefix + "key must be 32 bytes for aes256");
}

if (process.env.APP_TOKEN === undefined) {
  throw Error(errorPrefix + "APP TOKEN is undefined");
}

export const appToken = process.env.APP_TOKEN;

//try {
export const decodedAppToken: AppTokenDecoded = JWT.decode(
  appToken
) as AppTokenDecoded;

console.log(U.printAppToken(decodedAppToken));

// get context
export const context = get(
  { uuid: decodedAppToken.instance },
  { id: decodedAppToken.product },
  decodedAppToken.env,
  appToken
);

export const hostMdm = "https://mdm.tssapplications.com";

export const port = process.env.PORT ? Number(process.env.PORT) : 3000;

//} catch (err) {
//  console.log(err);
//  throw Error(errorPrefix + "app token could not be read");
//}
