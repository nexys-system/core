import * as Domain from "./index";
//import { request } from './request-helper';
import PS from "../../product";

jest.mock("../../product");

const mockRequest = PS.qs.list as jest.Mock;

test("get domains", async () => {
  const domains = [
    { id: 1, name: "domain" },
    { id: 2, name: "domain2" },
    { id: 3, name: "domain3" },
  ];

  const domainStrings = domains.map((_) => _.name);

  mockRequest.mockResolvedValue(domains);

  expect(await Domain.listByCeid("yceid")).toEqual(domainStrings);
});

test("checkDomain", async () => {
  const domains = [
    { id: 1, name: "gmail.com" },
    { id: 2, name: "domain2" },
    { id: 3, name: "domain3" },
  ];

  const domainStrings = domains.map((_) => _.name);

  mockRequest.mockResolvedValue(domains);
  expect(await Domain.check("john.doe@gmail.com", "myceid")).toEqual(true);
});
