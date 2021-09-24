import * as U from "./utils";
import * as T from "./type";
test("formatNotification", () => {
  const x1: T.NotifOut = {
    uuid: "m",
    cms: { uuid: "d" },
    type: { id: 2, name: "fd" },
    isValidationRequired: false,
  };

  const x2: T.NotifOut = {
    uuid: "m",
    cms: { uuid: "d" },
    type: { id: 2, name: "fd" },
    isValidationRequired: false,
    dateEnd: ("2021-01-01" as any) as Date,
  };

  const x3: T.NotifOut = {
    uuid: "m",
    cms: { uuid: "d" },
    type: { id: 2, name: "fd" },
    isValidationRequired: false,
    dateStart: ("2051-01-01" as any) as Date,
  };

  // validation required but no logs
  const x4: T.NotifOut = {
    uuid: "m",
    cms: { uuid: "d" },
    type: { id: 2, name: "fd" },
    isValidationRequired: true,
  };

  // validation required with logs
  const x5: T.NotifOut = {
    uuid: "m",
    cms: { uuid: "d" },
    type: { id: 2, name: "fd" },
    isValidationRequired: true,
    NotificationUserExternal: [{} as T.NotificationUserExternal],
  };

  expect(U.filterNotifications(x1)).toEqual(true);
  expect(U.filterNotifications(x2)).toEqual(false);
  expect(U.filterNotifications(x3)).toEqual(false);
  expect(U.filterNotifications(x4)).toEqual(true);
  expect(U.filterNotifications(x5)).toEqual(false);
});
