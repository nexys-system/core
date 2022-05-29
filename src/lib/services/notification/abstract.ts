import * as Type from "./type";

import { Context } from "../../context/type";

type Uuid = string;

abstract class NotificationService {
  context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  abstract list(
    types?: Type.NotificationType[],
    userUuid?: Uuid,
    lang?: string,
    overrideProductId?: number
  ): Promise<Type.OutPublic[]>;

  abstract accept(userUuid: Uuid, uuid: Uuid): Promise<Type.OutAccept[]>;

  abstract byUser(uuid: Uuid): Promise<Type.OutAccept[]>;
}

export default NotificationService;
