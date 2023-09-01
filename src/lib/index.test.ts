import * as I from "./index";

test("main imports", () => {
  expect(typeof I.App).toEqual("function");
});
