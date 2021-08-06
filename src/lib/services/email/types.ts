export interface Attachment {
  type: string;
  name: string;
  content: string; // base 64
}
/* attachment example
see https://mandrillapp.com/api/docs/messages.nodejs.html
[
  {
    type: "text/plain",
    name: "myfile.txt",
    content: "ZXhhbXBsZSBmaWxl",
  },
],
*/

export interface Recipient {
  email: string;
  name?: string;
  type: "to" | "cc" | "bcc";
}

export interface Recipients {
  recipients: Recipient[];
}

export interface EmailPayload extends Recipients {
  title: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
}

export interface CMSPayload extends Recipients {
  key?: string;
  uuid?: string;
}

export interface MandrillResponseUnit {
  email: string;
  status: "queued" | "sent";
  _id: string;
  reject_reason?: string | null;
}
