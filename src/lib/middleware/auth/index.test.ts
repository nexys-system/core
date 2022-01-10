import A from ".";
import Cache from "@nexys/node-cache";
import { Locale } from "./type";

type Uuid = string;

// create instance of auth

interface Profile {
  id: number;
}

interface ProfileUuid {
  id: Uuid;
}

interface UserCache {
  permissions: [];
  locale: Locale;
}

test("create instance of auth", () => {
  const auth = new A<Profile, UserCache>(
    "" as any,
    new Cache({ persistent: true }),
    "mysecret"
  );

  expect(auth instanceof A);
});

test("create instance of auth = string uuid", () => {
  const auth = new A<ProfileUuid, UserCache, Uuid>(
    "" as any,
    new Cache({ persistent: true }),
    "mysecret"
  );

  expect(auth instanceof A);
});
