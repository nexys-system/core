import * as Index from "./index";

test("imports", () => {
  expect(typeof Index.Service).toEqual("function");
  expect(typeof Index.Service("host", "auth")).toEqual("object");
});
