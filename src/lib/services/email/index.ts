type Uuid = string;
import * as U from "./utils";
import {
  EmailPayload,
  CMSPayload,
  Attachment,
  MandrillResponseUnit,
  Recipient,
} from "./types";
import ProductService from "../product";

class EmailService extends ProductService {
  active: boolean;
  constructor(host: string, authToken: string, active: boolean = true) {
    super(host, authToken);

    this.active = active;
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

    return await this.request("/email", payload, "POST");
  };

  async findAndSend(
    uuidOrKey: string,
    to: string | (string | Recipient)[],
    params?: { [key: string]: string }
  ) {
    const recipients = U.parseRecipients(to);

    const payload: CMSPayload = { recipients };

    if (U.isUuid(uuidOrKey)) {
      payload.uuid = uuidOrKey;
    } else {
      payload.key = uuidOrKey;
    }

    if (!this.active) {
      console.warn("The Email Service is not configured to send emails");
      // console.log(`Logging CMS uuid ${uuid} with params ${JSON.stringify(params)} the recipients are: ${JSON.stringify(recipients)}`);

      return false;
    }

    return await this.request("/email/cms", { ...payload, params }, "POST");
  }

  logs = async (): Promise<{ uuid: Uuid; logDateAdded: Date }[]> =>
    this.request("/email/log/list");
}

export default EmailService;
