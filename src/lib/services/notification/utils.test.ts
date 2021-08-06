import * as Utils from "./utils";
import { nsIn, nsOut } from "./mock";

// for future references:
// generic mock for product service
//jest.mock("../product-service");
//const mockNList = P.Notification.list as jest.Mock;
//mockNList.mockResolvedValue(nsIn);
// end generic

test("get notifications", () => {
  expect(Utils.toPublic(nsIn)).toEqual(nsOut);
});
