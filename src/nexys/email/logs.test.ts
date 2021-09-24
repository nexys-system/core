import * as Logs from "./logs";
import { Email, EmailLog } from "./type";
type AppContext = any;
const context: AppContext = {
  instance: "myinstanceuuid",
  product: 34,
  env: 3,
  email: {
    apiKey: "mykey",
    sender: {
      name: "fromName",
      email: "fromEmail",
    },
  },
};

test("emailToLog", () => {
  const email: Email = {
    title: "mytitle",
    text: "text",
    recipients: [],
    sendAt: new Date("2019-09-08").toJSON(),
  };
  const e: Omit<EmailLog, "uuid"> = {
    instance: { uuid: "myinstanceuuid" },
    product: { id: 34 },
    subject: "mytitle",
    body: "text",
    recipients: "[]",
    from: "fromName, fromEmail",
    logDateAdded: new Date("2019-09-08"),
  };

  expect(Logs.emailToLog(email, context)).toEqual(e);
});
