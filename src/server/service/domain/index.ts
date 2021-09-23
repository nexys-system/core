import { Id, Uuid } from "@nexys/utils/dist/types";
import { qs } from "../../product";
import * as U from "./utils";

interface Domain {
  uuid: Uuid;
  name: string;
  company: { id: Id };
}

const entity = "Domain";

export const insert = (data: Omit<Domain, "uuid">) =>
  qs.insertUuid(entity, data);

export const insertByCeid = async (ceid: string, domain: string) => {
  const company = await qs.find("Company", { filters: { ceid } }, true);
  if (!company) {
    throw Error("company could not be found");
  }

  const { id: companyId } = company;
  return insert({ company: { id: companyId }, name: domain });
};

export const listByCeid = async (ceid: string): Promise<string[]> => {
  const l: Domain[] = await qs.list<Domain>(entity, {
    filters: { company: { ceid } },
  });

  return l.map((x) => x.name);
};

export const check = async (email: string, ceid: string): Promise<boolean> => {
  const domain = U.domainFromEmail(email);

  const domains: string[] = await listByCeid(ceid);

  return domains.includes(domain);
};
