import * as CMSService from "../cms";
import { Context } from "../context";

import * as Logs from "./logs";
import * as MandrillService from "./mandrill";
import * as T from "./type";

export const getByLanguage = async (
  uuidOrKey: string,
  email: T.EmailCore,
  lang?: string,
  params?: any
): Promise<T.Email> => {
  const { title, content, isHtml } = await CMSService.getByLanguage(
    uuidOrKey,
    lang,
    params
  );

  return {
    ...email,
    title,
    html: isHtml ? content : undefined,
    text: !isHtml ? content : undefined,
  };
};

export const send = async (
  email: T.Email,
  context: Context
): Promise<T.MandrillResponseUnit[] | { message: string; email: T.Email }> => {
  try {
    const logResult = await Logs.insert(email, context);
    console.log(logResult);

    // NOTE: emails are only sent for prod tokens
    if (context.env && context.email) {
      console.info("Email: Prod config, sending");
      const { email: emailContext } = context;

      if (!emailContext) {
        throw Error("email context could not be found");
      }

      return MandrillService.send(email, emailContext);
      // TODO: save Mandrill id result._id in logs
    }

    return {
      message: `Email logged, not sent; env: ${context.env}`,
      email,
    };
  } catch (err: any) {
    console.log(err);
    throw Error(err);
  }
};

export const findAndSend = async (
  uuidOrKey: string,
  lang: string,
  email: T.EmailCore,
  params = {},
  context: Context
) => {
  const emailToSend = await getByLanguage(uuidOrKey, email, lang, params);
  return send(emailToSend, context);
};

/**
 * @param id of the message (returned by mandrill)
 * @return message delivery status
 */
export const info = (id: string, emailContext: T.ContextEmail) =>
  MandrillService.info(id, emailContext);

/**
 * @param  {[type]} ctx context
 * @return list of emails sent
 */
export const logList = async (ctx: Context) => Logs.list(ctx);
