import JWT from "./jwt";

test("encode", () => {
  const j = new JWT("mysecret");
  const e = { a: "a", b: "a" };
  const s = j.sign(e);
  const o = j.verify(s);
  const r = { ...e, iat: o.iat };

  expect(r).toEqual(o);
  expect(j.read(s)).toEqual(o);
});
