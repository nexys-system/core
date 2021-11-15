/**
 * this service allows to use the external fetchr service
 */
import { Query, Mutate, MutateResponse } from "@nexys/fetchr/dist/type";
import AbstractServiceWData from "./abstract-service-wdata";
import fetch from "node-fetch";

const hostDefault = "https://crud.nexys.io";

type QueryResponse = any;

class QueryServiceExternal extends AbstractServiceWData {
  host: string;
  appToken: string;

  constructor(appToken: string, host: string = hostDefault) {
    super();

    this.host = host;
    this.appToken = appToken;
  }

  request = async <A>(path: string, data: any): Promise<A> => {
    const url = this.host + path;

    const method = "POST";
    const body = JSON.stringify(data);
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.appToken,
    };

    const r = await fetch(url, {
      method,
      body,
      headers,
    });

    return r.json();
  };

  data = async (query: Query): Promise<QueryResponse> =>
    this.request("/data", query);

  mutate = async (query: Mutate): Promise<MutateResponse> =>
    this.request("/mutate", query);

  aggregate = async (query: any): Promise<any> => {
    console.warn("this is an experimental feature, do not push on prod");
    return this.request("/aggregate", query);
  };
}

export default QueryServiceExternal;
