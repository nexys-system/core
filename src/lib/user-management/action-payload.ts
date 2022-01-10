import * as CryptoService from "@nexys/crypto";
import { ActionPayload, Action } from "./type";

type Uuid = string;

export const createActionPayload = (
  uuid: Uuid,
  instance: { uuid: Uuid },
  action: Action,
  secretKey: string,
  duration: number = 24 * 3600 * 1000 // resource is valid for 1 day, by default
): string => {
  const issued = new Date().getTime();
  const expires = issued + duration;

  const payload: ActionPayload = {
    uuid,
    instance,
    action,
    issued,
    expires,
  };
  return CryptoService.Symmetric.encrypt(JSON.stringify(payload), secretKey);
};

export const decryptPayload = (
  ciphertext: string,
  secretKey: string,
  expectedAction?: Action
): ActionPayload => {
  try {
    const decrypted = CryptoService.Symmetric.decrypt(ciphertext, secretKey);
    const r: ActionPayload = JSON.parse(decrypted);

    const dt = new Date().getTime();

    if (r.issued > dt) {
      throw Error("resource was not created yet (this should never happen)");
    }

    if (r.expires < dt) {
      throw Error("resource expired");
    }

    if (expectedAction && r.action !== expectedAction) {
      throw Error("wrong excepted action");
    }

    return r;
  } catch (err) {
    throw Error("could not decrypt encrypted string" + err);
  }
};
