import nock from "nock";
import * as Request from "./index";

test("mock call 400", async () => {
  nock("http://httpstat.us").get("/400").reply(400, {});

  try {
    await Request.call({ url: "http://httpstat.us/400" });
  } catch (err) {
    expect(err.status).toBe(400);
    expect(err.body).toEqual({});
    expect(err.message).toEqual("400, Bad Request: {}");
  }
});

test("mock call 400 - full", async () => {
  nock("http://httpstat.us").get("/400").reply(400, "test", {
    "content-type": "text/plain",
  });

  try {
    await Request.call({ url: "http://httpstat.us/400" }, true);
  } catch (err) {
    expect(err.status).toBe(400);
    expect(err.body).toEqual("test");
    expect(err.message).toEqual("400, Bad Request: test");
  }
});

test("mock call 504", async () => {
  nock("http://httpstat.us").get("/504").reply(504, { response: false });

  try {
    await Request.call({ url: "http://httpstat.us/504" });
  } catch (err) {
    expect(err.status).toBe(504);
    expect(err.body).toEqual({ response: false });
    // TODO: expect(err.message).toEqual(...);
  }
});

test("mock call 504 - full", async () => {
  nock("http://httpstat.us").get("/504").reply(504, "test");

  try {
    await Request.call({ url: "http://httpstat.us/504" }, true);
  } catch (err) {
    expect(err.status).toBe(504);
    expect(err.body).toEqual("test");
    // TODO: expect(err.message).toEqual(...);
  }
});
