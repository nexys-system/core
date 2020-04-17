import fs from 'fs';

export type Id = number | string;

export interface OptionSet {
  id: number,
  name: string
}

// https://bitbucket.org/echo_rm/ts-is-present/src/master/
// but does not seem to work
export function isDefined<T>(t: T | undefined): t is T {
  return t !== undefined;
}

export interface File {
  value: Buffer | fs.ReadStream,
  filename: string,
  size: number,
  contentType: string
}

export interface Entity {
  name: string,
  id: Id
}

export interface ObjectWithId {
  id: Id
}