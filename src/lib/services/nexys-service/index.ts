import fetch from "node-fetch";

const host = process.env.NEXYS_SERVICE_HOST;

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
    console.log("about to call NEXYS HOST: " + host);
    const method = "POST";
    console.log({ url, body, headers });
    const r = await fetch(url, { headers, method, body });

    return r.json();
  } catch (err) {
    throw err;
  }
};
