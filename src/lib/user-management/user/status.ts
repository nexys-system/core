import { Status } from "../type";

const statusMap = new Map([
  [Status.active, "active"],
  [Status.pending, "pending"],
  [Status.inactive, "inactive"],
]);

export const statusToLabel = (s: Status) => {
  const st = statusMap.get(s);
  if (!st) {
    throw Error("could not find status");
  }

  return st;
};
