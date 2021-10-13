import * as Utils from "@nexys/utils";
import * as Company from "./company/crud";
import * as DomainService from "./domain";

import { workflow, email } from "../product";

export const update = async (
  uuid: Utils.types.Uuid,
  company: { id: number; ceid: string }
): Promise<any> => {
  // #1 change to tss friendly
  await Company.update(company.id, { tssFriendly: true });

  const companyRow = await Company.detail(company.id);

  /*const aCompany = await Academy.insertWithCountryISO(
    CompanyUtils.toCompanyISO(companyRow)
  );*/

  // move to next node
  const transitionUuid = "52daeeba-9f58-11ea-90f0-42010aac0009";
  const s = await workflow.state(uuid);
  const { data } = s;
  // add company ceid

  data.ceid = company.ceid;
  const st = await workflow.step(uuid, {
    uuid: transitionUuid,
    data,
  });

  return { data, aCompany: "todo", stepMessage: st.message };
};

/**
 * complete domain step and move to notification phase
 * @param addDomain: add domain to the list of domains
 * @param domain: domain
 */
export const updateDomain = async (
  uuid: Utils.types.Uuid,
  domain: string,
  addDomain: boolean
) => {
  const transitionUuid = "52c15a70-88b7-11ea-90f0-42010aac0009";

  const s = await workflow.state(uuid);
  const { data } = s;
  const { ceid } = data;

  if (typeof ceid !== "string") {
    throw Error("the ceid could not be extracted from state");
  }

  // add domain to the list of associated domain with ceid
  if (addDomain) {
    const d = await DomainService.insertByCeid(ceid, domain);
  }

  // update state with extra state
  data.domainOk = true;
  const st = await workflow.step(uuid, {
    uuid: transitionUuid,
    data,
  });
  // send email with notification link

  const uuidEmail = "8f6a163e-bf8c-11ea-90f0-42010aac0009";
  const link: string =
    "https://tssacademy.biz/signup/notification?uuid=" + uuid;
  const e = await email.findAndSend(uuidEmail, data.profile.email, {
    link,
  });

  return { data, stepMessage: st.message, e };
};

export const detail = async <A = any>(
  uuid: Utils.types.Uuid,
  step: number
): Promise<A> => {
  const nodeUuid: Utils.types.Uuid =
    step === 1
      ? "3c646bc2-9f58-11ea-90f0-42010aac0009"
      : "32302d6d-88b7-11ea-90f0-42010aac0009";

  const r = await workflow.state<any & { ceid: string }>(uuid);

  if (r.node.uuid !== nodeUuid) {
    throw Error("Workflow is not in sync with your query");
  }

  if (r.data.ceid) {
    const company = await Company.detailByCeid(r.data.ceid);
    return { ...r.data, company };
  }

  const company = r.data.businessPartnerNew;

  return { ...r.data, company };
};
