import fetch from "node-fetch";
import { Context } from "../../context/type";

const host = "http://localhost:3000";

export const request = async <Input, Output = any>(
  path: string,
  payload: Input,
  appToken: string
): Promise<Output> => {
  const headers = {
    "content-type": "application/json",
    "app-token": appToken,
  };
  const body = JSON.stringify(payload);

  const url = host + path;

  try {
    const r = await fetch(url, { headers, body });

    return r.json();
  } catch (err) {
    throw err;
  }
};
