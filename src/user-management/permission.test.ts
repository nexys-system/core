import I from "./permission";

import * as M from "./mock";

const PermissionService = new I(M.qs as any);

describe("login", () => {
  test("fetch permissions", async () => {
    const permissions = await PermissionService.permissionNamesByUser(
      M.userUuid
    );

    expect(permissions).toEqual(M.permissions);
  });
});
