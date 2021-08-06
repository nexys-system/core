import ProductService from "../product";

class SnippetService extends ProductService {
  async exec(
    uuid: string,
    p: { data: any; params: any; headers: any } = {
      data: undefined,
      params: undefined,
      headers: undefined,
    }
  ) {
    const { data, params, headers } = p;
    const payload = {
      uuid,
      data,
      params,
    };

    return await this.request("/api/snippet", payload, headers);
  }
}

export default SnippetService;
