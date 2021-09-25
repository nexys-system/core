export enum Env {
  prod = 3,
  test = 2,
  dev = 1,
}

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
