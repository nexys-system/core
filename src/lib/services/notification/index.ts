type Uuid = string;
import ProductService from "../product/service";
import * as Type from "./type";
import * as Utils from "./utils";

import { Context } from "../../context/type";
import { request } from "../nexys-service";

export { Type };

class NotificationServiceWrapper extends ProductService {
  context: Context;

  constructor(host: string, authToken: string, context: Context) {
    super(host, authToken);

    this.context = context;
  }

  async listAdmin(
    types: Type.NotificationType[],
    userUuid?: Uuid,
    lang: string = "en",
    overrideProductId?: number
  ): Promise<Type.Out[]> {
    if (!types || !Array.isArray(types) || types.length === 0) {
      throw new Error("types array undefined");
    }

    return request<{
      types: string[];
      lang: string;
      context: Pick<Context, "product" | "instance">;
      userUuid?: Uuid;
      overrideProductId?: number;
    }>(
      "/notification/listAdmin",
      {
        types,
        lang,
        context: {
          product: this.context.product,
          instance: this.context.instance,
        },
        userUuid,
        overrideProductId,
      },
      this.context.appToken
    );
  }

  async list(
    types: Type.NotificationType[] = ["signup"],
    userUuid?: Uuid,
    lang: string = "en",
    overrideProductId?: number
  ): Promise<Type.OutPublic[]> {
    const r: Type.Out[] = await this.listAdmin(
      types,
      userUuid,
      lang,
      overrideProductId
    );

    return Utils.toPublic(r);
  }

  /**
   * @param user user identifier (external, no dependencies/references)
   * @param uuids list of notification uuids
   */
  accept = (userUuid: Uuid, uuid: Uuid): Promise<Type.OutAccept[]> =>
    request<{ uuid: Uuid; user: Uuid; instanceUuid: Uuid }>(
      "/request/accept",
      { uuid, user: userUuid, instanceUuid: uuid },
      this.context.appToken
    );

  /*
   * list of notifications that were accepted by the user
   * @param uuid: user uuid
   */
  byUser = (uuid: Uuid): Promise<Type.OutAccept[]> =>
    request<{ user: Uuid; instance: { uuid: Uuid } }, Type.OutAccept[]>(
      "/notification/byUser",
      { user: uuid, instance: this.context.instance },
      this.context.appToken
    );
}

export default NotificationServiceWrapper;
