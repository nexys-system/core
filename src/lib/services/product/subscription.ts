import ProductService from "./service";

class ProductServiceExtra extends ProductService {
  constructor(host: string, appToken: string) {
    super(host, appToken);
  }

  /**
   * init the product service with the data def etc
   * @param instance: true: refreshed the data that's saved at instance level (workflow, requests etc)
   */
  subscribe = (instance: boolean = false): Promise<{ message: string }> =>
    this.request("/app/subscribe" + (instance ? "?instance=true" : ""));

  getSubscribe = (): Promise<any> => this.request("/app/get");

  ensureSubscribed = async (
    instance: boolean = false
  ): Promise<{ message: string }> => {
    try {
      return await this.getSubscribe();
    } catch (err) {
      if ((err as any).body && (err as any).body.message === "Not configured") {
        try {
          return await this.subscribe(instance);
        } catch (err) {
          throw Error("Failed to ensure subscription");
        }
      }

      throw Error("Failed to ensure subscription2");
    }
  };
}

export default ProductServiceExtra;
