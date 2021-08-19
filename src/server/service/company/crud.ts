import * as CT from "../../crud";
import { qs } from "../../product";
import { params, toCompany } from "./utils";

const entity = "Company";

export const detail = async (id: number): Promise<CT.Company> => {
  const d = (await qs.find(entity, params(id))) as CT.BusinessPartner & {
    country: { id: number; name: string };
  };
  return toCompany(d);
};
export const detailByCeid = async (ceid: string): Promise<CT.Company> => {
  const p = params(undefined, undefined, undefined, ceid);
  const d = (await qs.find(entity, p)) as CT.BusinessPartner & {
    country: { id: number; name: string };
  };
  return toCompany(d);
};

export const update = async (id: number, data: Partial<CT.BusinessPartner>) => {
  const r = await qs.update<CT.BusinessPartner>(entity, id, data);
  return r;
};
