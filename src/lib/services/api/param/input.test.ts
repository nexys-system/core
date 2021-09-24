import * as I from "./input";

test("prepare body", () => {
  const r = I.prepareBody('{"name":"{{varToBeReplaced}}"}', [
    { key: "varToBeReplaced", value: "myvalue" },
  ]);
  const e = { name: "myvalue" };

  expect(r).toEqual(e);
});

test("prepare body with escape character", () => {
  const r = I.prepareBody('{"name":"{{varToBeReplaced}}"}', [
    { key: "varToBeReplaced", value: "my\nvalue" },
  ]);
  const e = { name: "my\nvalue" };

  expect(r).toEqual(e);
});
