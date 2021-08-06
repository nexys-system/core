import * as fetch from "node-fetch";
import { Headers } from "./types";

export const returnsString = (headers: Headers) => {
  if (!headers) return false;

  const contentType = headers["content-type"];
  if (!contentType) return true; // NOTE: if no content-type, parse as string

  // console.info(`Request: received response with content-type: ${contentType}`);

  const contentTypes = ["text/plain", "application/json"];
  return contentTypes.some((c) => contentType.trim().toLowerCase().includes(c));
};

export const parseJSON = (body: any) => {
  try {
    return JSON.parse(body);
  } catch (err) {
    return body || {};
  }
};

export const parseBody = (body: any) => {
  if (Buffer.isBuffer(body)) {
    body = body.toString("utf-8");
  }

  return parseJSON(body);
};

export const parseResponse = (
  body: any,
  response: any,
  resolveResponse?: any
) => {
  if (returnsString(response.headers)) {
    body = parseBody(body); // NOTE: if JSON, handle buffers
  }

  if (resolveResponse) {
    return {
      ...response, // NOTE: return JSON response
      body,
    };
  }

  return body;
};

export const setBearerToken = (token: string, headers: Headers = {}) => ({
  ...headers,
  Authorization: `Bearer ${token}`,
});

export const getBody = async (response: fetch.Response) => {
  const { headers } = response;
  const contentType = headers.get("content-type");
  const isJson = contentType?.includes("application/json"); // here we use includes because it can also contain extra information like charset, eg ; charset=utf-8
  const isBinary =
    contentType === "application/pdf" ||
    contentType === "application/octet-stream";

  if (isJson) {
    return await response.json();
  }

  if (isBinary) {
    return await response.buffer();
  }
  return await response.text();
};
