import I from "./index";

import * as M from "../mock";

const UserService = new I(M.qs as any);

describe("user service", () => {
  test("getUserByEmailWithPassword", async () => {
    const r = await UserService.getUserByEmailWithPassword(M.email);

    const { profile, status, hashedPassword } = r;

    expect(status).toEqual(M.status);
    expect(hashedPassword).toEqual(M.hashedPassword);
    expect(profile).toEqual(M.profile);
  });
});
