import * as T from "./type";

export const toPublic = (r: T.Out[]): T.OutPublic[] =>
  r.map((x) => toPublicUnit(x));

export const toPublicUnit = (x: T.Out): T.OutPublic => ({
  uuid: x.uuid,
  content: x.cms.content,
  title: x.cms.title,
  isValidationRequired: x.isValidationRequired,
});
