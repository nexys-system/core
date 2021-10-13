// manages the first step of the signup
import * as Utils from "@nexys/utils";
import { Uuid } from "@nexys/utils/dist/types";

import * as PS from "../../product";

import * as CompanyService from "../company";

import * as T from "./type";
import * as DomainService from "../domain";
import { transitions, ms } from "./utils";
import { hostMdm } from "../../config";
import { domainFromEmail } from "../domain/utils";

const { delay } = Utils.promise;

const urlMdmCompany = (uuid: Utils.types.Uuid) =>
  hostMdm + "/app/onboarding/" + uuid + "/company";
const urlMdmDomain = (uuid: Utils.types.Uuid) =>
  hostMdm + "/app/onboarding/" + uuid + "/domain";

/**
 * get list of companies for typeahead
 *  */
export const company = async (
  searchName: string,
  countryCode: string
): Promise<
  {
    ceid: string;
    name: string;
  }[]
> => CompanyService.listNamesAndCeids(searchName, countryCode);

/**
 *
 * @param uuid worflow instance uuid
 * @param s state profile
 *
 * // see if domain exists
 * if not helpdesk
 * else return state to frontend that redirects to notifications
 */
export const domainStep = async (
  uuid: string,
  s: T.Signup
): Promise<{ message: string; pending?: true; uuid: Utils.types.Uuid }> => {
  if (!s.ceid) {
    throw Error("ceid is not present, signup fails");
  }

  const check: boolean =
    s.isIbm || (await DomainService.check(s.profile.email, s.ceid));

  if (check) {
    // transition domain match
    const s = await PS.workflow.step(uuid, { uuid: transitions[2] });
    await delay(ms);
    // transition notification
    const s2 = await PS.workflow.step(uuid, { uuid: transitions[3] });
    return { uuid, message: s.message + "\n" + s2.message };
  } else {
    const transitionUuid = `472e8a8a-88b7-11ea-90f0-42010aac0009`;
    const domain = domainFromEmail(s.profile.email);

    const message =
      "Signup: a new request for a new domain: " +
      domain +
      ` Manage: ${urlMdmDomain(uuid)}`;
    const _t = await PS.workflow.step(uuid, {
      uuid: transitionUuid,
      data: { ...s, text: message },
    });
    return { message: "notification from helpdesk", uuid, pending: true };
  }
};

export const newBusinessPartner = async (
  uuid: string,
  s: T.Signup
): Promise<{ message: string; pending: true; uuid: Utils.types.Uuid }> => {
  if (!s.businessPartnerNew) {
    throw Error("business partner new is not present, signup fails");
  }

  const transitionUuid = "449c51ef-9f58-11ea-90f0-42010aac0009";
  const message =
    "Signup: a new request for a new business partner: " +
    s.businessPartnerNew.name +
    ` (${s.businessPartnerNew.countryCode}). Manage: ${urlMdmCompany(uuid)}`;
  const t = await PS.workflow.step(uuid, {
    uuid: transitionUuid,
    data: { ...s, text: message },
  });
  return { message: "notification from helpdesk", pending: true, uuid };
};

export const signupIbmUser = async (
  profile: T.Profile,
  app: T.TssApp
): Promise<{ uuid: Uuid }> => {
  const signup: T.Signup = {
    profile,
    isIbm: true,
    ceid: "ibm",
    app,
  };

  return signupSubmission(signup);
};

export const signupSubmission = async (
  s: T.Signup
): Promise<{ message: string; uuid: Uuid }> => {
  // step 1: init workflow and insert data
  const data = {
    ...s,
    // app: T.TssApp.academy,
    text:
      "a new user signed-up:" + s.profile.firstName + " " + s.profile.lastName,
  };

  console.log("data!");
  console.log(data);
  const w = await PS.workflow.init("f386eed1-6209-11ea-90f0-42010aac0009", {
    uuid: transitions[0],
    data,
  });

  await delay(ms);
  // get uuid from workflow
  const { uuid } = w;
  console.log(`workflow uuid ${uuid}`);
  console.log(s);

  // step 2: company exist or not
  // if exist
  console.log({ ceid: s.ceid, b: s.businessPartnerNew });
  if (s.ceid && !s.businessPartnerNew) {
    console.log(`ceid ${s.ceid}`);
    await PS.workflow.step(uuid, { uuid: transitions[1] });

    await delay(ms);

    console.log("check domain");

    // step 3: check domain
    return domainStep(uuid, s);
  }

  // business partner does not exist
  // -> transition
  if (s.businessPartnerNew) {
    console.log("new business partner");
    return await newBusinessPartner(uuid, s);
  }

  throw Error("something went wrong while submitting signup information");
};
