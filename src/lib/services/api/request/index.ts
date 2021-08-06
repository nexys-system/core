import ProductService from "../../product-service";

type Uuid = String;

export default class RequestService extends ProductService {
  exec = (
    uuid: Uuid,
    {
      data,
      params,
    }: // headers,
    {
      data?: any;
      params?: { [key: string]: string };
      // headers?: { [key: string]: string };
    } = {}
  ) =>
    this.request(
      "/api/request",
      {
        uuid,
        data,
        params,
      },
      "POST"
    );

  logs = (
    uuid: Uuid
  ): Promise<
    { uuid: Uuid; responseBody: string; inputs: string; logDateAdded: Date }[]
  > => this.request("/api/request/logs", { uuid });
}
