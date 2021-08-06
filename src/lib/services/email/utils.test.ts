import { Recipient } from "./types";
import * as U from "./utils";

const out = [
  { email: "info@nexys.ch", type: "to" },
  { email: "systems@nexys.ch", type: "to" },
];

describe("parse recipients", () => {
  test("single", () => {
    const email = "info@nexys.ch";
    const recipient = U.parseRecipients(email);
    expect(recipient).toEqual([out[0]]);
  });

  test("multiple", () => {
    const emails = ["info@nexys.ch", "systems@nexys.ch"];
    const recipients = U.parseRecipients(emails);
    expect(recipients).toEqual(out);
  });

  test("multiple (string)", () => {
    const emails = ["info@nexys.ch", "systems@nexys.ch"].join(", ");
    const recipients = U.parseRecipients(emails);
    expect(recipients).toEqual(out);
  });

  test("with bcc", () => {
    const emails: Recipient[] = [{ type: "bcc", email: "systems@nexys.ch" }];
    const recipients = U.parseRecipients(emails);
    expect(recipients).toEqual([{ email: "systems@nexys.ch", type: "bcc" }]);
  });

  test("mixed", () => {
    const emails: (string | Recipient)[] = [
      "info@nexys.ch",
      { type: "bcc", email: "systems@nexys.ch" },
    ];
    const recipients = U.parseRecipients(emails);
    expect(recipients).toEqual([
      out[0],
      { email: "systems@nexys.ch", type: "bcc" },
    ]);
  });
});

test("is uuid", () => {
  expect(U.isUuid("2acb14ea-eeca-11eb-9a03-0242ac130003")).toEqual(true);
  expect(U.isUuid("2acb1738-eeca-11eb-9a03-0242ac130003")).toEqual(true);
  expect(U.isUuid("d3cb7e5d-3bbe-451d-a216-b6df09eb2fab")).toEqual(true);
  expect(U.isUuid("hello world")).toEqual(false);
});
