import nock from "nock";
import RequestService from "./index";

const host = "http://myhost";
const token = "mytoken";
const requestService = new RequestService(host, token);

const uuid = "myuuid";
const data = { text: "bla" };

const response = { message: "ok" };

nock(host)
  .post("/api/request", { uuid, data })
  .matchHeader("authorization", "bearer " + token)
  .matchHeader("content-type", "application/json")
  .reply(200, response, undefined);

describe("request", () => {
  test("exec", async () => {
    const r = await requestService.exec(uuid, { data });

    expect(r).toEqual(response);
  });
});

/*

test("exec - live", async () => {
  const token: string = // insert token here
 const host = "https://flow.nexys.io";

  const R = new RequestService(host, token);
  const uuid = "22d4b34e-5d4b-11ea-90f0-42010aac0009";

  const r = await R.exec(uuid, { data: { text: "test-fromlib" } });

  expect(r).toEqual("ok");
});

*/
