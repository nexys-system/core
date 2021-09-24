import * as T from "./type";
import fetch from "node-fetch";

const host = "https://mandrillapp.com/api/1.0";

export const send = (
  email: T.Email,
  s: T.ContextEmail
): Promise<T.MandrillResponseUnit[]> => {
  const { title, recipients = [], sendAt = null, attachments } = email;
  // send_at: UTC timestamp in YYYY-MM-DD HH:MM:SS

  const from_email = email.sender?.email || s.sender.email;
  const from_name = email.sender?.name || s.sender.name;

  const message: T.MandrillMessage = {
    to: recipients,
    subject: title,
    text: email.text,
    html: email.html,
    from_email,
    from_name,
    attachments,
  };

  return request<T.MandrillResponseUnit[]>(
    "/messages/send",
    { message },
    s.apiKey
  );
};

export const info = (id: string, s: T.ContextEmail) =>
  request<T.MandrillResponseUnit[]>("/messages/info", { id }, s.apiKey);

const request = async <A>(path: string, data: any, key: string): Promise<A> => {
  try {
    const r = await fetch(host + path, {
      method: "POST",
      body: JSON.stringify({ key, ...data }),
    });
    const j = await r.json();
    return j;
  } catch (e: any) {
    console.log("A mandrill error occurred: " + e.name + " - " + e.message);
    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    return Promise.reject(e);
  }
};
