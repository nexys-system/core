import * as CMS from "./cms";
import * as CMSLang from "./lang";

import { HTTP } from "@nexys/lib";

describe("get by language", () => {
  const uuid = "c4c73c6e-4241-11e9-a96c-dac139d6861d";
  (CMS as any).get = jest.fn();

  test("not available", async () => {
    (CMS.get as any).mockReturnValueOnce({});

    await expect(CMSLang.get(uuid)).rejects.toThrow(HTTP.Error);
  });

  test("undefined content", async () => {
    (CMS.get as any).mockReturnValueOnce({ en: { title: "" } });

    await expect(CMSLang.get(uuid)).rejects.toThrow(HTTP.Error);
  });

  test("get english (default)", async () => {
    (CMS.get as any).mockReturnValueOnce({
      en: { title: "", content: "asdf" },
    });

    const result = await CMSLang.get(uuid);
    expect(result.content).toEqual("asdf");
  });

  test("get french with params", async () => {
    (CMS.get as any).mockReturnValueOnce({
      en: {},
      fr: { title: "", content: "asdf ${test}" },
    });

    const params = { test: 2 };
    const result = await CMSLang.get(uuid, "fr", params);
    expect(result.content).toEqual("asdf 2");
  });
});
