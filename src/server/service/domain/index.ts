import { Id, Uuid } from "@nexys/utils/dist/types";
import { qs } from "../../product";

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
