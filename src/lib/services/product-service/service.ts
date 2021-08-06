import fetch from "node-fetch";
import * as FT from "node-fetch";

class ProductService {
  host: string;
  token: string;
  constructor(host: string, token: string) {
    this.host = host;
    this.token = token;
  }

  request = async (
    path: string,
    data?: any,
    method: "GET" | "POST" = "GET"
  ) => {
    const url = this.host + path;
    const body: string | undefined = data ? JSON.stringify(data) : undefined;
    const headers = {
      "content-type": "application/json",
      authorization: "bearer " + this.token,
    };

    const options: FT.RequestInit = {
      method,
      headers,
      body,
    };

    const r = await fetch(url, options);

    if (r.status !== 200) {
      return Promise.reject({ status: r.status, body: r.text() });
    }

    return r.json();
  };
}

export default ProductService;
