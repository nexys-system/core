import Product from "../../product";
import * as CT from "../../crud";
import { QueryParams } from "@nexys/fetchr/dist/type";

export const listNamesAndCeids = async (
  partialName: string,
  countryCode: string
): Promise<{ ceid: string; name: string }[]> => {
  // console.log(partialName)

  if (partialName.length < 3) {
    return Promise.resolve([]);
  }

  const p: QueryParams = {
    projection: {
      ceId: true,
      name: true,
    },
    filters: {
      name: { $regex: "^" + partialName },
      country: { iso2: countryCode },
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
