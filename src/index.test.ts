import * as I from "./index";

test("main imports", () => {
  Object.entries(I).map((p) => {
    const [k, v] = p;

    if (k !== "App") {
      expect(typeof v).toEqual("object");
    }
  });
});
