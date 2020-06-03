import * as I from "./index";

test("checkHeaders", () => {
  const h1 = {
    "content-type": "application/json",
  };
  expect(I.checkHeaders(h1)).toEqual(true);

  const h2 = {};
  expect(I.checkHeaders(h2)).toEqual(false);

  const h3 = {
    "content-typ": "application/json",
  };
  expect(I.checkHeaders(h3)).toEqual(false);

  const h4 = {
    "content-type": "application",
  };
  expect(I.checkHeaders(h4)).toEqual(false);
});
