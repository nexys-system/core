import * as U from "./utils";

test("getFinalUrl", () => {
  expect(U.getFinalUrl("http://host", "/my/path")).toEqual(
    "http://host/my/path"
  );
});

test("getFinalUrl with query string", () => {
  expect(U.getFinalUrl("http://host", "/my/path", { p1: "myp1" })).toEqual(
    "http://host/my/path?p1=myp1"
  );
});

test("get Query string", () => {
  expect(U.getQueryString({ p1: "myp1" })).toEqual("?p1=myp1");
  expect(U.getQueryString({})).toEqual(undefined);
});
