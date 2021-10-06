type Uuid = string;
import * as U from "./utils";
import {
  EmailPayload,
  Attachment,
  MandrillResponseUnit,
  Recipient,
} from "./types";
import ProductService from "../product";

import * as EmailService from "../../../nexys/email";
import * as EmailLogService from "../../../nexys/email/logs";
import { Context } from "../../context/type";

class EmailService2 extends ProductService {
  active: boolean;
  context: Context;
  constructor(
    host: string,
    authToken: string,
    context: Context,
    active: boolean = true
  ) {
    super(host, authToken);

    this.active = active;
    this.context = context;
  }

  send = async (
    to: string | (string | Recipient)[],
    title: string,
    text?: string,
    html?: string,
    attachments?: Attachment[]
  ): Promise<MandrillResponseUnit[]> => {
    const recipients = U.parseRecipients(to);

    const payload: EmailPayload = { title, text, html, recipients };

    if (attachments) {
      payload.attachments = attachments;
    }

    if (!this.active) {
      throw Error("The Email Service is not configured to send emails");
    }

    return EmailService.send(payload, this.context) as any;
  };

  async findAndSend(
    uuidOrKey: string,
    to: string | (string | Recipient)[],
    params?: { [key: string]: string }
  ) {
    const recipients = U.parseRecipients(to);

    if (!this.active) {
      console.warn("The Email Service is not configured to send emails");
      // console.log(`Logging CMS uuid ${uuid} with params ${JSON.stringify(params)} the recipients are: ${JSON.stringify(recipients)}`);

      return false;
    }

    const lang = "en";

    const email = { recipients }; //, sendAt };

    return EmailService.findAndSend(
      uuidOrKey,
      lang,
      email,
      params,
      this.context
    );
  }

  logs = async (): Promise<{ uuid: Uuid; logDateAdded: Date }[]> =>
    EmailLogService.list(this.context);
}

export default EmailService2;
