export interface Error {
  path: string[];
  message: string;
  type: string;
}

export interface Options {
  presence?: string;
  abortEarly?: boolean;
  allowUnknown?: boolean;
  format?: { prefix: string };
}
