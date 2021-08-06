type Uuid = string;
import ProductService from "../product/service";
import * as Type from "./type";
import * as Utils from "./utils";

export { Type };

class NotificationService extends ProductService {
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

    return await this.request("/notification", payload, "POST");
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
    return await this.request(
      "/notification/accept",
      { uuid, userUuid },
      "POST"
    );
  }

  /*
   * list of notifications that were accepted by the user
   * @param uuid: user uuid
   */
  async byUser(uuid: Uuid): Promise<Type.OutAccept[]> {
    return await this.request("/notification/byUser", { uuid }, "POST");
  }
}

export default NotificationService;
