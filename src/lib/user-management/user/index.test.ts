import I from "./index";

import * as M from "../mock";

const userService = new I(M.qs as any);

describe("user service", () => {
  test("getUserByEmailWithPassword", async () => {
    const { profile, status, auth } =
      await userService.getUserByAttributeWithAuth({
        value: M.email,
        key: "email",
      });

    expect(status).toEqual(M.status);
    expect(auth.value).toEqual(M.hashedPassword);
    expect(profile).toEqual(M.profile);
  });
});
