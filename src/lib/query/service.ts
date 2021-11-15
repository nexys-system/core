import { Query, Mutate, MutateResponse } from "@nexys/fetchr/dist/type";

import Fetchr from "@nexys/fetchr";

import AbstractServiceWData from "./abstract-service-wdata";

//import * as AggregateService from '@nexys/fetchr/dist/query-builder/aggregate'

type QueryResponse = any;

class QueryService extends AbstractServiceWData {
  fetchr: Fetchr;
  constructor(f: Fetchr) {
    super();

    this.fetchr = f;
  }

  data = async (query: Query): Promise<QueryResponse> =>
    this.fetchr.query(query);

  mutate = async (query: Mutate): Promise<MutateResponse> =>
    this.fetchr.mutate(query);

  aggregate = async (_query: any): Promise<any> => {
    throw "todo";
  };
}

export default QueryService;
