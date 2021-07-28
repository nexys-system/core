import * as I from "./index";
import HTTP from "@nexys/http";

test("throw normal error", () => {
  expect(I.handleError(Error("my message"))).toEqual({
    status: I.defaultStatus,
    body: { message: I.defaultMessage },
  });
});

test("throw http error", () => {
  const error = { custom: "error" };
  const status = 400;
  expect(I.handleError(new HTTP.Error(error, status))).toEqual({
    status,
    body: error,
  });
});

test("throw http error (do not expose", () => {
  const error = { custom: "error" };
  expect(I.handleError(new HTTP.Error(error, 500))).toEqual({
    status: I.defaultStatus,
    body: { message: I.defaultMessage },
  });
});
