import { QueryParams } from "@nexys/fetchr/dist/type";
import { Uuid } from "@nexys/utils/dist/types";
import { Context } from "../context";

import * as NexysQueryService from "../nexys";

import * as T from "./type";
import * as Utils from "./utils";

export const list = async (
  types: string[],
  language: string,
  context: Context,
  userUuid?: Uuid,
  overrideProductId?: number
): Promise<T.Response[]> => {
  const productId = overrideProductId || context.product.id;

  const params: QueryParams = {
    projection: {
      status: {},
      cms: {},
      type: {},
    },
    filters: {
      instance: { uuid: context.instance.uuid },
      product: { id: productId },
      type: {
        name: { $in: types },
      },
    },
  };

  if (userUuid) {
    params.references = {
      NotificationUserExternal: { filters: { user: userUuid } },
    };
  }

  const notifications: T.NotifOut[] = (
    await NexysQueryService.list<T.NotifOut>("Notification", params)
  ).filter((x) => Utils.filterNotifications(x));

  if (!notifications || notifications.length === 0) {
    return [];
  }

  const cms = notifications.map((item) => item.cms.uuid);
  const paramsI18n = {
    filters: {
      isCms: true,
      uuid: { $in: cms },
    },
    references: {
      i18nValue: {
        filters: {
          logIsLog: false,
        },
        projection: {
          language: {},
        },
      },
    },
  };

  const translations = await NexysQueryService.list<T.Translation>(
    "i18nKey",
    paramsI18n
  );
  return Utils.formatNotificationContent(notifications, translations, language);
};

export const accept = async (
  uuid: T.Uuid,
  user: T.Uuid,
  instanceUuid: T.Uuid
) => {
  const instance = { uuid: instanceUuid };

  const data = {
    notification: { uuid },
    user,
    instance,
    logDateAdded: new Date(),
  };

  return await NexysQueryService.insert("NotificationUserExternal", data);
};

export const listByUser = async (user: T.Uuid, instance: { uuid: T.Uuid }) => {
  const params = {
    filters: { instance, user },
    projection: { logDateAdded: true, uuid: true, notification: true },
  };

  return await NexysQueryService.list<any>("NotificationUserExternal", params);
};
