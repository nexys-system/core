type Uuid = string;
import * as U from "./utils";
import {
  EmailPayload,
  Attachment,
  MandrillResponseUnit,
  Recipient,
} from "./types";
import ProductService from "../product";

import { Context, ContextEmail } from "../../context/type";
import { request } from "../nexys-service";

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

    if (!this.context.email) {
      throw Error("can't send email: email context undefined");
    }

    const context: Pick<Context, "email" | "env"> = {
      email: this.context.email,
      env: this.context.env,
    };

    return request<{
      payload: EmailPayload;
      context: Pick<Context, "email" | "env">;
    }>("/email/send", { payload, context }, this.token);
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

    if (!this.context.email) {
      throw Error("can't send email: email context undefined");
    }

    const lang = "en";

    const email = { recipients }; //, sendAt };

    const context: Pick<Context, "email" | "env"> = {
      email: this.context.email,
      env: this.context.env,
    };

    return request<{
      uuidOrKey: string;
      lang: string;
      email: { recipients: Recipient[] };
      params?: { [key: string]: string };
      context: Pick<Context, "email" | "env">;
    }>(
      "/email/findAndSend",
      { uuidOrKey, lang, email, params, context },
      this.token
    );
  }

  logs = async (): Promise<{ uuid: Uuid; logDateAdded: Date }[]> =>
    request<Pick<Context, "instance" | "product">>(
      "/email/logs",
      { instance: this.context.instance, product: this.context.product },
      this.token
    );
}

export default EmailService2;
