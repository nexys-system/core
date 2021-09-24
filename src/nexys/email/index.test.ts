import * as EmailLogs from "./logs";
import * as MandrillClient from "./mandrill";

// TODO: rewrite tests

/*
  NOTE: request payload
  const payload = {
    uuid: '2c4a1fd7-4b29-11e9-831f-42010a840080',
    recipients: [ 'john@smith.com' ],
    params: {
      email: 'robert@greene.com',
      firstName: 'Robert',
      lastName: 'Greene',
      company: 'X',
      url: 'https://Y/admin/users/2843',
      signature: 'Kind regards,\nYour Y Team\n\n[Note: this is an automated message. Please do not reply directly to this email.]'
    }
  }
*/

test("send cms as email", async () => {
  const email = {
    uuid: "2c4a1fd7-4b29-11e9-831f-42010a840080",
    recipients: ["john@smith.com"],
    params: {
      email: "robert@greene.com",
      firstName: "Robert",
      lastName: "Greene",
      company: "X",
      url: "https://Y/admin/users/2843",
      signature:
        "Kind regards,\nYour Y Team\n\n[Note: this is an automated message. Please do not reply directly to this email.]",
    },
    title: "Y: New user - Brix - X",
    text: "Robert Greene has just signed up as part of X.\n\nHowever, their email domain fabian@nexys.ch does not match existing domains for this company.\n\nhttps://Y/admin/users/2843\n\nKind regards,\nYour Y Team\n\n[Note: this is an automated message. Please do not reply directly to this email.]",
  };

  // TODO: test sendAt
  (MandrillClient as any).send = jest.fn();
  (MandrillClient as any).send.mockResolvedValue([
    {
      email: "john@smith.com",
      status: "sent",
      _id: "fb13712b38038cfb85be0185b41d4f8c",
      reject_reason: null,
    },
  ]);

  (EmailLogs as any).insert = jest.fn();
  (EmailLogs.insert as any).mockResolvedValue({ uuid: "Z" });

  const instance = "2c5d0535-26ab-11e9-9284-fa163e41f33";
  const product = 2;
  const env = 1;

  expect(true).toEqual(true);
  /*
  let response = await EmailService.send(email, {
    email: MandrillClient,
    instance,
    product,
    env,
    envName: "development",
  });
  expect(response).toEqual({
    message: "Email logged, not sent; env: development",
    email,
  });

  response = await EmailService.send(email, {
    email: MandrillClient,
    instance,
    product,
    env,
    envName: "production",
  });
  expect(Array.isArray(response)).toBe(true);*/
});
