/// <reference lib="dom" />

import * as Type from "./type";

import * as NexysService from "../nexys-service";
import { Context } from "../../context/type";

const method = "POST";

class RepositoryService {
  context: Pick<Context, "appToken">;
  constructor(context: Pick<Context, "appToken">) {
    this.context = context;
  }
  /**
   * upload file to file repo
   * @param payload
   */
  upload = async (
    payload: Type.UploadPayload
  ): Promise<{ status: boolean }> => {
    const form = new FormData();
    form.append("name", payload.name);
    // see
    // https://stackoverflow.com/a/43914175/1659569
    form.append(
      "file",
      new Blob([payload.file.value]),
      payload.file.options.filename
    );

    const headers = {
      //...form.getHeaders(),
      "app-token": this.context.appToken,
    };

    const options = {
      method,
      body: form,
      headers,
    };

    const url = NexysService.host + "/file/upload";

    const response = await fetch(url, options);
    return response.json();
  };

  /**
   * serve file
   * @param filename filename
   */
  serve = async (name: string): Promise<ArrayBuffer> => {
    const url = NexysService.host + "/file/serve";

    const data = { name };

    const headers = {
      "content-type": "application/json",
      "app-token": this.context.appToken,
    };

    const r = await fetch(url, {
      body: JSON.stringify(data),
      headers,
      method,
    });
    return r.arrayBuffer();
  };

  write = (filename: string, data: string): Promise<{ status: boolean }> => {
    const payload = { name: filename, data };

    return NexysService.request("/file/write", payload, this.context.appToken);
  };
}

export default RepositoryService;
