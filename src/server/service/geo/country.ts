import P from "../../product";
import * as Utils from "@nexys/utils";

import * as CT from "../../crud";
import {
  QueryFilters,
  QueryParams,
  QueryProjection,
} from "@nexys/fetchr/dist/type";

export const list = async () => {
  return P.qs.list("Country");
};

const mapToUOptionSet = (c: CT.Country): Utils.types.UOptionSet => ({
  uuid: c.iso3166Alpha2,
  name: c.name,
});

export const listUOptionSet = async (): Promise<Utils.types.UOptionSet[]> => {
  const filters: QueryFilters = {};
  const projection: QueryProjection<CT.Country> = {
    id: true,
    name: true,
    iso3166Alpha2: true,
  };
  const params: QueryParams = {
    projection,
    filters,
    order: { by: "name" },
  };
  const p = await P.qs.list<CT.Country>("Country", params);
  return p.map(mapToUOptionSet);
};
