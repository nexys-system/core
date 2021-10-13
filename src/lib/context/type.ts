export type Workflow = any;
export type Request = any;

export interface ContextEmail {
  apiKey?: string;
  sender: { email: string; name: string };
}

export enum Env {
  prod = 3,
  test = 2,
  dev = 1,
}

export interface Context {
  env: Env;
  instance: { uuid: string };
  workflow: Workflow[];
  request: Request[];
  email?: ContextEmail;
  product: { id: number };
  appToken: string;
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

export type ContextFile = "workflow" | "request";
