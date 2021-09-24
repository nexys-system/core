type Uuid = string;
import ProductService from "../product/service";
import * as Type from "./type";
import * as Utils from "./utils";

import * as NotificationService from "../../../nexys/notification";

export { Type };
import { context } from "../../../nexys/context";

class NotificationServicew extends ProductService {
  async listAdmin(
    types: Type.NotificationType[],
    userUuid?: Uuid,
    lang: string = "en"
  ): Promise<Type.Out[]> {
    const payload = {
      types,
      lang,
      userUuid,
    };

    if (!types || !Array.isArray(types) || types.length === 0) {
      throw new Error("types array undefined");
    }

    return await NotificationService.list(types, lang, context, userUuid);
  }

  async list(
    types: Type.NotificationType[] = ["signup"],
    userUuid?: Uuid,
    lang: string = "en"
  ): Promise<Type.OutPublic[]> {
    const r: Type.Out[] = await this.listAdmin(types, userUuid, lang);

    return Utils.toPublic(r);
  }

  /**
   * @param user user identifier (external, no dependencies/references)
   * @param uuids list of notification uuids
   */
  async accept(userUuid: Uuid, uuid: Uuid): Promise<Type.OutAccept[]> {
    return NotificationService.accept(
      uuid,
      userUuid,
      context.instance.uuid
    ) as any as Type.OutAccept[];
  }

  /*
   * list of notifications that were accepted by the user
   * @param uuid: user uuid
   */
  async byUser(uuid: Uuid): Promise<Type.OutAccept[]> {
    return await NotificationService.listByUser(uuid, context.instance);
  }
}

export default NotificationServicew;
