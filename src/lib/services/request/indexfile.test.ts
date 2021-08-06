import nock from "nock";
import * as Request from "./index";
import fs from "fs";
const filepath = __dirname + "/dummy.pdf";
const c = fs.readFileSync(filepath);

test("mock call file", async () => {
  const contentType = "application/pdf";
  nock("https://test.com")
    .get("/")
    .replyWithFile(200, __dirname + "/dummy.pdf", {
      "Content-Type": contentType,
    });

  const result = await Request.call({ url: "https://test.com" }, true);

  expect(result.body).toEqual(c);
  expect(result.status).toEqual(200);
  expect(result.headers.get("content-type")).toEqual(contentType);
});

test("mock call file octet", async () => {
  const contentType = "application/octet-stream";
  nock("https://test.com").get("/").replyWithFile(200, filepath, {
    "Content-Type": contentType,
  });

  const result = await Request.call({ url: "https://test.com" }, true);

  expect(result.body).toEqual(c);
  expect(result.status).toEqual(200);
  expect(result.headers.get("content-type")).toEqual(contentType);
});
