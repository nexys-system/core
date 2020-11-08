import JWT from "./jwt";

test("encode", () => {
  const j = new JWT("mysecret");
  const e = { a: "a", b: "a" };
  const s = j.sign(e);
  const o = j.verify(s);

  expect({ ...e, iat: o.iat }).toEqual(o);
});
