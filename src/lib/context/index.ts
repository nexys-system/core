import fs, { promises as fsp } from "fs";

import * as T from "./type";

type Id = number;
type Uuid = string;

const path = "assets";

const getPath = (file: T.ContextFile) => path + "/" + file + ".json";

export const saveContent = async (content: any, file: T.ContextFile) => {
  await fsp.writeFile(getPath(file), JSON.stringify(content), "utf-8");
  return true;
};

export const getFileContent = <A>(file: T.ContextFile): A => {
  const c = fs.readFileSync(getPath(file), "utf-8");

  return JSON.parse(c);
};

export const getFileContentAsArray = <A>(file: T.ContextFile): A[] => {
  try {
    return getFileContent<A[]>(file);
  } catch (err) {
    return [];
  }
};

const emailDefault: T.ContextEmail = {
  sender: { email: "info@nexys.io", name: "Info" },
};

export const get = (
  instance: { uuid: Uuid },
  product: { id: Id },
  env: T.Env,
  appToken: string,
  email: T.ContextEmail = emailDefault
): T.Context => {
  const workflow = getFileContentAsArray<T.Workflow>("workflow");
  const request = getFileContentAsArray<Request>("request");

  return { workflow, request, instance, env, product, email, appToken };
};
