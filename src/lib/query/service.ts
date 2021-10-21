import { Query, Mutate, MutateResponse } from "@nexys/fetchr/dist/type";

import Fetchr from "@nexys/fetchr";

import AbstractServiceWData from "./abstract-service-wdata";

type QueryResponse = any;

class QueryService extends AbstractServiceWData {
  fetchr: Fetchr;
  constructor(f: Fetchr) {
    super();

    this.fetchr = f;
  }

  async data(query: Query): Promise<QueryResponse> {
    return this.fetchr.query(query);
  }

  async mutate(query: Mutate): Promise<MutateResponse> {
    return this.fetchr.mutate(query);
  }
}

export default QueryService;
