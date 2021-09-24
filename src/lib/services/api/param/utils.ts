const isObject = (value: any): boolean =>
  typeof value === "object" && !Array.isArray(value) && value !== null;

export const linearize = (
  obj: any,
  keys: string[] = []
): { key: string; value: any }[] => {
  let list: { key: string; value: any }[] = [];

  Object.entries(obj).map(([key, value]) => {
    const next = [...keys, key];
    if (isObject(value)) {
      const subList = linearize(value, next);
      list = [...list, ...subList];
    } else {
      list.push({ key: next.join("."), value });
    }
  });

  return list;
};
