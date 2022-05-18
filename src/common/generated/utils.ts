import { Permissions } from './type';

export const roleMap: Map<string, Permissions> = new Map(
  Object.entries(Permissions)
    .filter(([_k, v]) => typeof v !== "number")
    .map(([k, v]) => [v as string, Number(k) as Permissions])
);