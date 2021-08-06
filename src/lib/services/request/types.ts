export interface Headers {
  [k: string]: string;
}

export type Method = "GET" | "POST" | "PUT" | "DELETE";

export interface Context extends Options {
  method?: Method;
  headers?: any;
  target?: string;
  url: string;
  payload?: any;
  encoding?: any;
  multipart?: boolean;
  auth?: any;
  query?: Headers;
}

export interface Options {
  url: string;
  payload?: any;
  multipart?: boolean;
  headers?: Object;
}

export interface Init {
  authToken: string;
  host?: string;
  i18n?: {
    local: boolean;
    path?: string;
  };
  production?: boolean;
}
