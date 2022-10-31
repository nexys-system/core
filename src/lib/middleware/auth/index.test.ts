import A from ".";
import Cache from "@nexys/node-cache";
import { Locale } from "./type";

interface UserCache {
  permissions: [];
  locale: Locale;
}

test("create instance of auth", () => {
  const auth = new A<UserCache>(
    "" as any,
    new Cache({ persistent: true }),
    "mysecret"
  );

  expect(auth instanceof A);
});

test("create instance of auth = string uuid", () => {
  const auth = new A<UserCache>(
    "" as any,
    new Cache({ persistent: true }),
    "mysecret"
  );

  expect(auth instanceof A);
});
