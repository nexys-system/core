import fs, { promises as fsp } from "fs";

const path = "assets";

type Workflow = any;

export interface Context {
  instance: { uuid: string };
  workflow?: Workflow[];
}

type ContextFile = "workflow" | "requests";

const getPath = (file: ContextFile) => path + "/" + file + ".json";

export const saveContent = async (content: any, file: ContextFile) => {
  await fsp.writeFile(getPath(file), JSON.stringify(content), "utf-8");
  return true;
};

export const getFileContent = <A>(file: ContextFile): A => {
  const c = fs.readFileSync(getPath(file), "utf-8");

  return JSON.parse(c);
};

const instance = { uuid: "2c5d0535-26ab-11e9-9284-fa163e41f33d" };

export const get = (): Context => {
  const workflow = getFileContent<Workflow[]>("workflow");
  console.log(workflow);

  return { workflow, instance };
};

export const context = get();
