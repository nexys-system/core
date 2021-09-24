import * as T from "./type";

export const formatNotificationContent = (
  notifications: T.NoticationCrud[],
  translations: T.Translation[],
  language: string
): T.Response[] => {
  return notifications.map((item: T.NoticationCrud) => {
    const pcms: T.Translation | undefined = translations.find(
      ({ uuid }) => uuid == item.cms.uuid
    );

    if (!pcms) {
      throw Error("translation could not be found");
    }

    const translation: T.I18nValue | undefined = pcms.i18nValue.find(
      (t) => t.language.name == language
    );

    if (!translation) {
      throw Error("translation language could not be found");
    }

    const { title, name: content } = translation;

    const cms: T.Cms = {
      uuid: pcms.uuid,
      isHtml: pcms.isHtml,
      title,
      content,
    };

    return {
      cms,
      type: item.type,
      uuid: item.uuid,
      isValidationRequired: item.isValidationRequired,
      dateStart: item.dateStart,
      dateEnd: item.dateEnd,
    };
  });
};

export const filterNotifications = (
  x: T.NotifOut,
  atDate: Date = new Date()
): boolean => {
  if (x.dateStart && new Date(x.dateStart) > atDate) {
    return false;
  }

  if (x.dateEnd && new Date(x.dateEnd) < atDate) {
    return false;
  }

  if (
    x.isValidationRequired &&
    x.NotificationUserExternal &&
    x.NotificationUserExternal.length > 0
  ) {
    return false;
  }

  return true;
};
