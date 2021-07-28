import * as L from "./locale";

test("from accept languge", () => {
  expect(
    L.headerAcceptLanguageToLocale("fr-CH;q=0.9,fr;q=0.8,de;q=0.7")
  ).toEqual({ lang: "fr", country: "CH" });
  expect(L.headerAcceptLanguageToLocale("random string")).toEqual({
    country: "US",
    lang: "en",
  });
});
