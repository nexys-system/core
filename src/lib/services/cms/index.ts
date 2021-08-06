import ProductService from "../product/service";

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

    return this.request("/cms", { uuid, lang, params }, "POST");
  }
}

export default CMSService;
