import { request } from "../nexys-service";
import { Uuid } from "@nexys/utils/dist/types";

export interface Out {
  title?: string;
  content: string;
  isHtml: boolean;
}

class CMSService {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  async get(
    uuid: Uuid,
    lang: string = "en",
    params?: { [key: string]: string }
  ): Promise<Out> {
    if (lang.length !== 2) {
      throw Error("lang must be an iso1 code (2 characters)");
    }

    // NOTE: lang == locale || iso2

    return request<{
      uuid: Uuid;
      lang: string;
      params?: { [key: string]: string };
    }>("/cms/get", { uuid, lang, params }, this.token);
  }
}

export default CMSService;
