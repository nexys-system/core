import * as T from "./type";
import NotificationService from "./index";
import nock from "nock";
import * as Mock from "./mock";

const host = "http://myhost.com";
const Notification = new NotificationService(host, "token");

describe("Notification", () => {
  test("get list admin", async () => {
    const response = Mock.out2;

    const types: T.NotificationType[] = ["banner"];
    const lang = "en";
    const body = { types, lang };
    nock(host)
      .post("/notification", body as nock.DataMatcherMap)
      .reply(200, response);

    const c = await Notification.listAdmin(types, undefined, lang);

    expect(c).toEqual(response);
  });

  test("get list", async () => {
    const types: T.NotificationType[] = ["banner"];
    const lang = "en";
    const body = { types, lang };
    nock(host)
      .post("/notification", body as nock.DataMatcherMap)
      .reply(200, Mock.nsIn);

    const c = await Notification.list(types, undefined, lang);

    expect(c).toEqual(Mock.nsOut);
  });

  test("accept", async () => {
    const uuids = ["uuid1", "uuid2"];
    const response = [
      { uuid: uuids[0], acknowledged: true },
      { uuid: uuids[1], acknowledged: true },
    ];

    const uuid = uuids[0];

    const body = { userUuid: "useruuid", uuid };
    nock(host)
      .post("/notification/accept", body as nock.DataMatcherMap)
      .reply(200, response);

    const c = await Notification.accept("useruuid", uuid);

    expect(c).toEqual(response);
  });
});
