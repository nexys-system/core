import { Context } from "../../lib/context/type";
import * as NexysQueryService from "../nexys-qs";

import * as T from "./type";

const entityEmailLog = "EmailLog";

export const emailToLog = (
  email: T.Email,
  context: Context
): Omit<T.EmailLog, "uuid"> => {
  if (!context.email) {
    throw Error("email undefined in context");
  }

  return {
    instance: { uuid: context.instance.uuid },
    product: { id: context.product.id },
    subject: email.title || "null",
    body: email.html || email.text || "no body",
    recipients: JSON.stringify(email.recipients),
    from: context.email.sender.name + ", " + context.email.sender.email,
    logDateAdded: email.sendAt ? new Date(email.sendAt) : new Date(),
  };
};

/**
 * insert email log in database
 * @return id of email log
 */
// TODO: logs should be part of app-specific database
export const insert = async (email: T.Email, context: any) => {
  // TODO: separate formatting => batch function
  const data = emailToLog(email, context);

  try {
    return await NexysQueryService.insert(entityEmailLog, data);
  } catch (err: any) {
    throw Error(err);
  }
};

const projection = {
  uuid: true,
  subject: true,
  recipients: true,
  logDateAdded: true,
  from: true,
};

export const list = async (
  context: Context
): Promise<Pick<T.EmailLog, keyof typeof projection>[]> =>
  NexysQueryService.list<T.EmailLog>(entityEmailLog, {
    projection,
    filters: {
      product: { id: context.product.id },
      instance: { uuid: context.instance.uuid },
    },
    order: { by: "logDateAdded", desc: true },
  });
