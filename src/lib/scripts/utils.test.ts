import * as U from "./utils";

const enumOut = `enum MyEnum {
  a = "a",
  b = "b",
  c = "c",
  d = "d",
}`;

test("createEnum", () => {
  expect(U.createEnum("MyEnum", ["b", "c", "a", "d"])).toEqual(enumOut);
});
