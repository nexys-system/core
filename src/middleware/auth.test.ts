import * as A from "./auth";
import Cache from "../cache/local";

test("readtoken", () => {
  const token = "mytoken";
  const t = A.readTokenHeaders({ authorization: "Bearer " + token });
  expect(t).toEqual(token);
});

// create instance of auth

interface Profile {
  id: number;
}

interface UserCache {
  cacheData: any;
}

const auth = new A.default<Profile, UserCache>(new Cache({ persistent: true }));

test("isPermissionValid", () => {
  const userPermissions = ["p1", "p2", "p3"];
  expect(auth.isPermissionValid("doesnotexist", userPermissions)).toEqual(
    false
  );
  expect(auth.isPermissionValid("p2", userPermissions)).toEqual(true);
});
