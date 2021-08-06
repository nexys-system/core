import { promises as file } from "fs";

export const exists = (path: string) =>
  file.stat(path).catch((err) => {
    if (err.code === "ENOENT") return false;
    throw err;
  });

export const dirExists = async (path: string): Promise<boolean> => {
  if (!(await exists(path))) {
    await file.mkdir(path, { recursive: true });
  }

  return true;
};

/**
 * @return file content
 * @param filepath: [path of the file]
 */
export const getContent = (
  filepath: string,
  encoding: "utf8" = "utf8"
): Promise<string> =>
  file.readFile(filepath, encoding).then((_) => _.toString());
