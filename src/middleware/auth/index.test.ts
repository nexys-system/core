import { Uuid } from "@nexys/utils/dist/types";
import A from ".";
import Cache from "../../cache/local";

// create instance of auth

interface Profile {
  id: number;
}

interface ProfileUuid {
  id: Uuid;
}

interface UserCache {
  permissions: [];
}

test("create instance of auth", () => {
  const auth = new A<Profile, UserCache>(
    new Cache({ persistent: true }),
    "mysecret"
  );

  expect(auth instanceof A);
});

test("create instance of auth = string uuid", () => {
  const auth = new A<ProfileUuid, UserCache, Uuid>(
    new Cache({ persistent: true }),
    "mysecret"
  );

  expect(auth instanceof A);
});
