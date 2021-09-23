import * as U from "./utils";

test("domainFromEmail", () => {
  expect(U.domainFromEmail("myname@domain.com")).toEqual("domain.com");
});
