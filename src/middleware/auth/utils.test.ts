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
