import {
  Query,
  Mutate,
  MutateResponse,
  ReturnUnit,
} from "@nexys/fetchr/dist/type";

import Fetchr from "@nexys/fetchr";

import AbstractServiceWData from "./abstract-service-wdata";
import * as TA from "@nexys/fetchr/dist/query-builder/aggregate/type";

class QueryService extends AbstractServiceWData {
  fetchr: Fetchr;
  constructor(f: Fetchr) {
    super();

    this.fetchr = f;
  }

  data = async (query: Query): Promise<ReturnUnit> => this.fetchr.query(query);

  mutate = async (query: Mutate): Promise<MutateResponse> =>
    this.fetchr.mutate(query);

  aggregate = async (query: TA.Query): Promise<TA.ResponseAggregate> =>
    this.fetchr.aggregate(query);
}

export default QueryService;
