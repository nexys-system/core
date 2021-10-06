import nock from "nock";

import * as RequestService from "./index";
import { ActionInput, Request, ParamType, DataType } from "../types";
import * as LogService from "./logs";

jest.mock("./logs");

const mockLogsInsert = LogService.insert as jest.Mock;
mockLogsInsert.mockImplementation((uuid, body) => {
  console.debug("[mock] insert log here: " + JSON.stringify({ uuid, body }));
  return true;
});

const instance = { uuid: "myinstance" };

// IMPORTANT: headers cannot be overwritten!

const standardRequest: Request = {
  uuid: "sndfg",
  host: "https://example.com",
  label: "Standard request",
  mappingIn: [
    {
      dataType: { id: DataType.String },
      inOrOut: true,
      isOptional: false,
      paramDefault: {
        name: "test1",
        paramType: { id: ParamType.body },
      },
      paramOverride: { name: "test_1", paramType: { id: ParamType.body } },
      valueDefault: undefined,
    },
    {
      dataType: { id: DataType.Number },
      inOrOut: true,
      isOptional: false,
      paramDefault: {
        name: "test2",
        paramType: { id: ParamType.body },
      },
      paramOverride: undefined,
      valueDefault: 2,
    },
    {
      dataType: { id: DataType.String },
      inOrOut: true,
      isOptional: false,
      paramDefault: {
        name: "Authorization",
        paramType: { id: 2 },
      },
      paramOverride: undefined,
      valueDefault: "Bearer TOKEN",
    },
  ],
  mappingOut: [
    {
      dataType: { id: DataType.String },
      inOrOut: false,
      isOptional: false,
      paramDefault: {
        name: "id",
        paramType: { id: ParamType.body },
      },
      paramOverride: { name: "test", paramType: { id: ParamType.body } },
      valueDefault: undefined,
    },
  ],
  rawbody: '{"name":"Lucy"}',
  method: { id: 2, name: "POST" },
  uri: "/standard/request",
};

test("standard request - success", async () => {
  nock("https://example.com")
    .post("/standard/request", { name: "Lucy" }, undefined)
    .matchHeader("authorization", "Bearer TOKEN")
    .reply(200, { id: 2 }, undefined);

  const data = { test_1: "test" };
  const headers = { authorization: "Bearer TOKEN" };

  const result = await RequestService.execWithMapping(
    standardRequest,
    {
      data,
      headers,
    },
    { instance } as any
  );
  expect(result.body).toEqual({ test: 2 });
});

test("standard request - error", async () => {
  nock("https://example.com")
    .post("/standard/request", undefined, undefined)
    .matchHeader("authorization", "Bearer TOKEN")
    .reply(500, "My Internal Server Error", undefined);

  const data = { test_1: "test" };
  const headers = { authorization: "Bearer TOKEN" };

  try {
    await RequestService.execWithMapping(standardRequest, { data, headers }, {
      instance,
    } as any);
  } catch (err) {
    const r = JSON.parse((err as any).message);
    expect(r.body).toEqual("My Internal Server Error");
    expect(r.status).toEqual(500);
  }
});

const arrayRequest = { ...standardRequest };
arrayRequest.mappingIn = [];
arrayRequest.mappingOut = [];

test("array in request", async () => {
  nock("https://example.com")
    .post("/standard/request", undefined, undefined)
    .reply(200, { success: true }, undefined);

  // todo this is not a real test
  const data: ActionInput = { data: [{ this: "works2" }] };

  const result = await RequestService.execWithMapping(arrayRequest, data, {
    instance,
  } as any);
  expect(result.body).toEqual({ success: true });
});

test("array out request", async () => {
  nock("https://example.com")
    .post("/standard/request", undefined, undefined)
    .reply(200, [{ success: true }], undefined);

  const data: ActionInput = { data: {} };
  const result = await RequestService.execWithMapping(arrayRequest, data, {
    instance,
  } as any);
  expect(result.body).toEqual([{ success: true }]);
});

// TODO: array out mappings
