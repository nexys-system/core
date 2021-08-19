import { QueryFilters, QueryParams } from "@nexys/fetchr/dist/type";
import * as CT from "../../crud";

export const getFilters = (
  id?: number,
  wwid?: string,
  countryCode?: string,
  ceid?: string,
  tssFriendly?: boolean
): QueryFilters => {
  if (id) {
    return { id };
  }

  if (ceid) {
    return { ceid };
  }

  if (wwid) {
    return { isObserved: true, wwid };
  }

  if (countryCode) {
    // when contry code is given, return all available companies
    return { country: { iso3166Alpha2: countryCode } };
  }

  if (tssFriendly !== undefined) {
    return { tssFriendly };
  }

  return { isObserved: true };
};

// todo add `isGoe` to companies
export const params = (
  id?: number,
  wwid?: string,
  countryCode?: string,
  ceid?: string,
  tssFriendly?: boolean
): QueryParams => {
  return {
    projection: {
      id: true,
      ceid: true,
      wwid: true,
      name: true,
      isObserved: true,
      tssFriendly: true,
      country: {
        id: true,
        iso3166Alpha2: true,
        market: { id: true, name: true, geo: { id: true, name: true } },
      },
    },
    filters: getFilters(id, wwid, countryCode, ceid, tssFriendly),
    order: { by: "name", desc: false },
  };
};

export const toCompany = (x: CT.BusinessPartner): CT.BusinessPartner => x;
