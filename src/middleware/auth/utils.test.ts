import * as A from "./utils";

test("readtoken", () => {
  const token = "mytoken";
  const t = A.readTokenHeaders({ authorization: "Bearer " + token });
  expect(t).toEqual(token);
});

test("isPermissionValid", () => {
  const userPermissions = ["p1", "p2", "p3"];
  expect(A.isPermissionValid("doesnotexist", userPermissions)).toEqual(false);
  expect(A.isPermissionValid("p2", userPermissions)).toEqual(true);
});

test("export basic token", () => {
  const t = A.extractBasicAuthToken("Basic mytoken");
  const t2 = "mytoken";

  expect(t2).toEqual(t);
});

test("create basic token", () => {
  const t = A.createBasicAuthToken("u1", "p1");
  const t2 = "dTE6cDE=";
  expect(t2).toEqual(t);

  const h = A.createBasicAuthHeaderString("u1", "p1");
  const h2 = "Basic dTE6cDE=";

  expect(h2).toEqual(h);
});