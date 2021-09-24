import fs, { promises as fsp } from "fs";

import { ContextEmail } from "./email/type";

const path = "assets";

type Workflow = any;
type Request = any;

enum Env {
  prod,
  test,
  dev,
}

export interface Context {
  env: Env;
  instance: { uuid: string };
  workflow: Workflow[];
  request: Request[];
  email?: ContextEmail;
  product: { id: number };
}

type ContextFile = "workflow" | "request";

const getPath = (file: ContextFile) => path + "/" + file + ".json";

export const saveContent = async (content: any, file: ContextFile) => {
  await fsp.writeFile(getPath(file), JSON.stringify(content), "utf-8");
  return true;
};

export const getFileContent = <A>(file: ContextFile): A => {
  const c = fs.readFileSync(getPath(file), "utf-8");

  return JSON.parse(c);
};

export const getFileContentAsArray = <A>(file: ContextFile): A[] => {
  try {
    return getFileContent<A[]>(file);
  } catch (err) {
    return [];
  }
};

const instance = { uuid: "2c5d0535-26ab-11e9-9284-fa163e41f33d" };
const env = Env.dev;
const product = { id: 3 };
const email: ContextEmail = {
  apiKey: "",
  sender: { email: "fds", name: "fd" },
};

export const get = (): Context => {
  const workflow = getFileContentAsArray<Workflow>("workflow");
  const request = getFileContentAsArray<Request>("request");

  return { workflow, request, instance, env, product, email };
};

export const context = get();
