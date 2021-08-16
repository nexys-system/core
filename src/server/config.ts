import * as FetchR from "@nexys/fetchr";
import dotenv from "dotenv";
import model from "./model";

dotenv.config();

export { model };

// init fetchr
export const database: FetchR.Database.Type.Database = {
  username: process.env.DATABASE_USER || "",
  host: process.env.DATABASE_HOST || "",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "",
  port: 3306,
};

export const secretKey = process.env.SECRET || ""; // key must be 32 bytes for aes256

export const instance = {
  name: process.env.INSTANCE_NAME || "",
  uuid: process.env.INSTANCE_UUID || "",
};

export const ssoGithub = {
  client_id: "6763ce57887aaf5a2197",
  client_secret: "7d34944b9f420a950eb52a9447627702bc1685fe",
};

export const host = "https://flow.nexys.io";
export const appToken = process.env.APP_TOKEN || "";
