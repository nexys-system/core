import Product from "../../product";
import * as CT from "../../crud";
import { QueryParams, QueryProjection } from "@nexys/fetchr/dist/type";

export const listNamesAndCeids = async (
  partialName: string,
  countryCode: string
): Promise<{ ceid: string; name: string }[]> => {
  // console.log(partialName)

  if (partialName.length < 3) {
    return Promise.resolve([]);
  }

  const projection: QueryProjection<CT.Company> = {
    ceid: true,
    name: true,
  };

  const p: QueryParams = {
    projection,
    filters: {
      name: { $regex: "^" + partialName },
      country: { iso3166Alpha2: countryCode },
    },
    take: 20,
  };

  const l: CT.Company[] = await Product.qs.list("Company", p);

  return l.map((x) => {
    return {
      ceid: x.ceid,
      name: x.name,
    };
  });
};
