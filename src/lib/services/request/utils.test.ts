import * as Request from "./utils";

describe("request returns string?", () => {
  test("json", () => {
    const headers = { "content-type": "application/json " };

    const result = Request.returnsString(headers);
    expect(result).toBe(true);
  });

  test("text", () => {
    const headers = { "content-type": "text/plain " };

    const result = Request.returnsString(headers);
    expect(result).toBe(true);
  });

  test("octet-stream", () => {
    const headers = { "content-type": "application/octet-stream" };

    const result = Request.returnsString(headers);
    expect(result).toBe(false);
  });
});

describe("parse request", () => {
  const str = '{ "test": "This is a test string" }';
  const buffer = Buffer.from(str, "utf8");

  const expected = { test: "This is a test string" };

  const response = {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
    },
    body: buffer,
  };

  test("body", () => {
    const result = Request.parseBody(buffer);
    expect(result).toEqual(expected);
  });

  const body = buffer;
  test("response", () => {
    const result = Request.parseResponse(body, response);
    expect(result).toEqual(expected);
  });

  test("full response", () => {
    const response = {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: buffer,
    };

    const result = Request.parseResponse(body, response, true);
    expect(result).toEqual(
      expect.objectContaining({
        body: expect.objectContaining(expected),
        statusCode: expect.anything(),
      })
    );
  });
});
