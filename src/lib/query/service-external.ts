/**
 * this service allows to use the external fetchr service
 */
import { Query, Mutate, MutateResponse } from "@nexys/fetchr/dist/type";
import AbstractServiceWData from "./abstract-service-wdata";
import fetch from "node-fetch";
import * as TA from "@nexys/fetchr/dist/query-builder/aggregate/type";
import * as TF from "@nexys/fetchr/dist/type";

const hostDefault = "https://crud.nexys.io";

type QueryResponse = any;

class QueryServiceExternal extends AbstractServiceWData {
  host: string;
  appToken: string;
  dataModel: TF.Entity[];

  constructor(appToken: string, dataModel: TF.Entity[], host: string = hostDefault) {
    super();

    this.host = host;
    this.appToken = appToken;
    this.dataModel = dataModel;
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

  modelSet = async ():Promise<{message: string}> => this.request("/model/set", this.dataModel);

  modelGet = async ():Promise<TF.Entity[]> => this.request("/model/get", this.dataModel);

  data = async (query: Query): Promise<QueryResponse> =>
    this.request("/data", query);

  mutate = async (query: Mutate): Promise<MutateResponse> =>
    this.request("/mutate", query);

  aggregate = async (query: TA.Query): Promise<TA.ResponseAggregate> => {
    console.warn("this is an experimental feature, do not push on prod");
    return this.request("/aggregate", query);
  };
}

export default QueryServiceExternal;
