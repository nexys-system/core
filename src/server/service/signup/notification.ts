import * as Utils from "@nexys/utils";

import jwt from "jsonwebtoken";

import * as PS from "../../product";

import { transitions, ms } from "./utils";

import * as T from "./type";
import { OutPublic } from "../../../lib/services/notification/type";

const { delay } = Utils.promise;

/** mappginf the app to the nexys product id, in order to get the notification */
const appToProductId = (a: T.TssApp): number => {
  switch (a) {
    case T.TssApp.madeEasy:
      return 51;
    default:
      return 2;
  }
};

const appToHost = (a: T.TssApp): string => {
  switch (a) {
    case T.TssApp.madeEasy:
      return "https://test.tssmadeeasy.com";
    default:
      return "https://test.tssacademy.biz";
  }
};

export const list = async (uuid: Utils.types.Uuid): Promise<OutPublic[]> => {
  const state = await PS.workflow.state(uuid);

  if (state.node.uuid !== "afa159fb-8171-11ea-90f0-42010aac0009") {
    throw Error("workflow does not have the right state");
  }

  const { app }: { app: T.TssApp } = state.data;

  // get notifications for the product of interest
  return PS.notifications.list(
    undefined,
    undefined,
    undefined,
    appToProductId(app)
  );
};

export const updateAndLogin = async ({
  uuid,
}: //notifications
{
  uuid: string;
  notifications: string[];
}): Promise<{ redirect: string }> => {
  // insert notifications
  // todo
  // console.log('notifiations');
  // retrieve information from UUID
  const state = await PS.workflow.state(uuid);
  // console.log({ state });

  const s = state.data as T.Signup;

  if (!s.ceid) {
    throw Error("ceid is not present, signup fails");
  }

  await PS.workflow.step(uuid, { uuid: transitions[4] });
  await delay(ms);

  console.log("data on finish ");
  console.log(s);

  const secretKey = "IBM-SignupGateway2021-auth-TSSA-TSSME";
  const token = jwt.sign(s, secretKey);
  const host = appToHost(s.app);

  return {
    redirect: host + "/signup/redirect?q=" + token,
  };
};
