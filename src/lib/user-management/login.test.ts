import I from "./login";
import * as M from "./mock";
import { decryptPayload } from "./action-payload";
import { localeDefault } from "./locale";
import { AuthenticationType } from "./crud-type";

const secret = "durbdhrbserjvcejg37fg3hcishfjkic";
const LoginService = new I(M.qs as any, secret);

describe("login service", () => {
  test("signup", async () => {
    const { token, ...r } = await LoginService.signup(
      {
        ...M.profile,
      },
      { value: "mypassword", type: AuthenticationType.password },
      localeDefault
    );

    expect(r).toEqual({
      uuid: "User_uuid",
      authentication: { uuid: "UserAuthentication_uuid" },
    });

    expect(typeof token).toEqual("string");

    const p = decryptPayload(token, secret);

    expect(p.uuid).toEqual("User_uuid");
  });
});
