import fetch from "node-fetch";

export const host: string =
  process.env.NEXYS_SERVICE_HOST || "https://service.nexys.io";

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
    console.log("about to call NEXYS HOST: " + url);
    const method = "POST";

    const r = await fetch(url, { headers, method, body });

    return r.json();
  } catch (err) {
    throw err;
  }
};
