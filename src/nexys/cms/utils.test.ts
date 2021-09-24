import * as U from "./utils";

describe("replace params", () => {
  test("p1", () => {
    const title = "mytitle";
    expect(
      U.replaceParams(title, "content with ${var}", { var: "subvar" })
    ).toEqual({ title, content: "content with subvar" });
  });

  test("p2", () => {
    const title = "";
    const content = "email ${email}";
    const test = "test email";
    const params = { email: test };
    const actual = U.replaceParams(title, content, params);
    const expected = { title, content: "email ".concat(test) };
    expect(actual).toEqual(expected);
  });
});

test("format values", () => {
  const e = U.formatValues([
    { title: "mytitle", name: "myname", language: { iso2: "en" } },
    { title: "mytitle2", name: "myname2", language: { iso2: "de" } },
  ]);

  const ex = {
    en: { title: "mytitle", content: "myname" },
    de: { title: "mytitle2", content: "myname2" },
  };

  expect(e).toEqual(ex);
});
