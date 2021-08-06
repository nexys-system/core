import ProductService from "../product-service";

class ChainService extends ProductService {
  // NOTE: simple constructor is generated

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

    return await this.request("/api/chain", payload, headers);
  }
}

export default ChainService;
