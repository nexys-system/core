import HTTP from "@nexys/http";
import * as T from "./types";

export const parseRecipientsToArray = (
  to: string | (string | T.Recipient)[]
): (string | T.Recipient)[] => {
  if (to instanceof Array) {
    return to;
  }

  if (typeof to === "string") {
    if (to.includes(", ")) {
      return to.split(", ");
    } else {
      return [to];
    }
  }

  throw new HTTP.Error("Please provide (a) valid recipient(s)!");
};

export const parseRecipients = (
  to: string | (string | T.Recipient)[]
): T.Recipient[] => {
  const arr = parseRecipientsToArray(to);

  return arr.map((email) => {
    if (typeof email === "string") {
      return { type: "to", email };
    }

    if ("email" in email) {
      return { email: email.email, type: email.type || "to", name: email.name };
    }

    throw Error("wrong formatting: " + JSON.stringify(email));
  });
};

export const isUuid = (uuid: string): boolean =>
  !!uuid.match(
    /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/
  );
