import I from "./index";

import * as M from "../mock";

const UserService = new I(M.qs as any);

describe("user service", () => {
  test("getUserByEmailWithPassword", async () => {
    const r = await UserService.getUserByAttributeWithAuth({
      value: M.email,
      key: "email",
    });

    const { profile, status, auth } = r;

    expect(status).toEqual(M.status);
    expect(auth.value).toEqual(M.hashedPassword);
    expect(profile).toEqual(M.profile);
  });
});
