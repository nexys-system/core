import * as I from "./index";

test("imports", () => {
  expect(typeof I.Cms).toEqual("function");
  expect(typeof I.I18n).toEqual("function");
  expect(typeof I.Notification).toEqual("function");
  expect(typeof I.default).toEqual("function");
});
