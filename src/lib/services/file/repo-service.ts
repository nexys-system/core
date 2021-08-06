import FormData from "form-data";

import * as Type from "./type";
import fetch from "node-fetch";
import ProductService from "../product/service";

const pathPrefix = "/file/repository";

class RepositoryService extends ProductService {
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
    form.append("file", payload.file.value, payload.file.options);

    const headers = {
      ...form.getHeaders(),
      authorization: "bearer " + this.token,
    };

    const options = {
      method: "POST",
      body: form,
      headers,
    };

    const response = await fetch(this.host + pathPrefix + "/upload", options);
    return response.json();
  };

  /**
   * serve file
   * @param filename filename
   */
  serve = async (filename: string): Promise<Buffer> => {
    const url =
      this.host + pathPrefix + "/serve/" + encodeURIComponent(filename);

    const r = await fetch(url, {
      headers: {
        "content-type": "application/json",
        authorization: "bearer " + this.token,
      },
      method: "GET",
    });
    return r.buffer();
  };

  write = (filename: string, data: string): Promise<{ status: boolean }> => {
    const payload = { name: filename, data };
    return this.request(pathPrefix + "/write", payload, "POST");
  };
}

export default RepositoryService;
