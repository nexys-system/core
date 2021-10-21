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
  headers: { [k: string]: string };
  constructor(appToken: string, host: string = hostDefault) {
    super();

    this.host = host;
    this.appToken = appToken;

    this.headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.appToken,
    };
  }

  async data(query: Query): Promise<QueryResponse> {
    const url = this.host + "/data";

    const body = JSON.stringify(query);

    const r = await fetch(url, { body, headers: this.headers });

    return r.json();
  }

  async mutate(query: Mutate): Promise<MutateResponse> {
    const url = this.host + "/mutate";

    const body = JSON.stringify(query);

    const r = await fetch(url, { body, headers: this.headers });

    return r.json();
  }
}

export default QueryServiceExternal;
