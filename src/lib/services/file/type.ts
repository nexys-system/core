export interface FileOptions {
  filename: string;
  size?: number;
}

// this is then mapped to same as import { File } from "formidable";
export interface FilePayload {
  value: Buffer;
  options: FileOptions;
}

// note here that `name` is not the filename but the name that is used in the productservice (it should be unique)
export interface UploadPayload {
  file: FilePayload;
  name: string;
}
