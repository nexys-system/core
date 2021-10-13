import { Env } from "../../lib/context/type";

export interface AppTokenDecodedCore {
  instance: string;
  product: number;
  env: Env;
}

export interface AppTokenDecoded extends AppTokenDecodedCore {
  instanceName: string;
  productName: string;
  envName: string;
  iat: number;
}
