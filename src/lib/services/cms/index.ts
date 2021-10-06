import ProductService from "../product/service";

import * as CmsService from "../../../nexys/cms";
import { request } from "../nexys-service";

type Uuid = string;

export interface Out {
  title?: string;
  content: string;
  isHtml: boolean;
}

class CMSService extends ProductService {
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
