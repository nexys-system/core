import I from "./auth";
import * as M from "./mock";
//import { decryptPayload } from "./action-payload";
import { localeDefault } from "./locale";

const secret = "durbdhrbserjvcejg37fg3hcishfjkic";
const LoginService = new I(M.qs, secret);

describe("login service", () => {
  test("signup", async () => {
    const { token, ...r } = await LoginService.signupWPassword(
      {
        ...M.profile,
      },
      "mypassword", //, type: AuthenticationType.password },
      localeDefault,
      [1]
    );

    expect(r).toEqual({
      uuid: "User_uuid",
      authentication: { uuid: "UserAuthentication_uuid" },
    });

    // expect(typeof token).toEqual("string");

    // const p = decryptPayload(token, secret);

    //   expect(p.uuid).toEqual("User_uuid");
  });
});
