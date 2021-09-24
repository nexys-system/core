import { Id, Uuid } from "@nexys/utils/dist/types";

export interface ContextEmail {
  apiKey: string;
  sender: { email: string; name: string };
}

export interface Attachment {
  type: string;
  name: string;
  content: string; // base 64
}

export interface EmailCore {
  recipients: Recipient[];
  sendAt?: string;
}

export interface Email extends EmailCore {
  title: string;
  html?: string;
  text?: string;
  attachments?: Attachment[];
  sender?: Sender;
}

export interface Sender {
  email: string;
  name: string;
}

export interface Recipient {
  email: string;
  type?: "to" | "cc" | "bcc";
}

export interface MandrillMessage {
  subject: string;
  from_email: string;
  from_name: string;
  to: Recipient[];
  text?: string;
  html?: string;
  attachments?: Attachment[];
}

export interface MandrillResponseUnit {
  email: string;
  status: "queued" | "sent";
  _id: string;
  reject_reason?: string | null;
}

export interface EmailLog {
  uuid: Uuid;
  instance: { uuid: Uuid };
  product: { id: Id };
  subject: string;
  recipients: string;
  body: string;
  from: string;
  logDateAdded: Date;
}
