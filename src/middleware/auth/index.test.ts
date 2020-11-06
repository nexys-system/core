import A from ".";
import Cache from "../../cache/local";

// create instance of auth

interface Profile {
  id: number;
}

interface UserCache {
  permissions: [];
}

test("create instance of auth", () => {
  const auth = new A<Profile, UserCache>(new Cache({ persistent: true }));

  expect(auth instanceof A);
});
