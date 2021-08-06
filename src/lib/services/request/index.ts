import * as fetch from "node-fetch";
import HTTP from "@nexys/http";

import { Context, Headers, Method } from "./types";
import { getBody } from "./utils";

const defaultHeaders: Headers = {
  accept: "application/json;q=0.9, */*;q=0.8",
  "content-type": "application/json",
};

const getMethod = ({
  method,
  payload,
}: Pick<Context, "method" | "payload">): Method => {
  if (method) {
    return method;
  }

  if (payload) {
    return "POST";
  }

  return "GET";
};

export const compile = (
  context: Context,
  timeout = 30 * 1000
): { options: fetch.RequestInit; url: string } => {
  const { url, payload, query, headers = defaultHeaders } = context;

  const queryString: string = query
    ? Object.entries(query)
        .map(([k, v]) => k + "=" + encodeURIComponent(v))
        .join("&")
    : "";

  const body: fetch.BodyInit | undefined = payload
    ? JSON.stringify(payload)
    : undefined;

  const options: fetch.RequestInit = {
    method: getMethod(context),
    headers,
    body,
    timeout,
  };

  return { url: url + queryString, options };
};

export const call = async (ctx: Context, resolveResponse = false) => {
  const { url, options } = compile(ctx);

  try {
    const response = await fetch.default(url, options);
    const { status, headers } = response;

    const body = await getBody(response);
    if (resolveResponse) {
      return { status, body, headers };
    }

    if (![200, 201].includes(status)) {
      throw new HTTP.Error(body, status);
    }

    return body;
  } catch (err) {
    throw err;
  }
};
