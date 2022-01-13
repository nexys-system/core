export const createEnum = (name: string, es: string[]): string => {
  const out = es
    .sort((a, b) => a.localeCompare(b))
    .map((e) => `  ${e} = "${e}",`);

  return [`enum ${name} {`, ...out, `}`].join("\n");
};

export const createEntities = (model: { name: string }[]): string => {
  const entities = model.map((e) => e.name);

  return "export " + createEnum("Entities", entities);
};

type Model = any;

export const createModelTs = (model: Model) =>
  [`const model = ${JSON.stringify(model)};`, "", "export default model"].join(
    "\n"
  );

export const getUtils = () => {
  return `import { Permissions } from './type';

export const roleMap: Map<string, Permissions> = new Map(
  Object.entries(Permissions)
    .filter(([_k, v]) => typeof v !== "number")
    .map(([k, v]) => [v as string, Number(k) as Permissions])
);`;
};
