export type Uuid = string;

export interface OptionSet {
  id: number;
  name: string;
}

export interface Cms {
  uuid: Uuid;
  isHtml: boolean;
  title?: string;
  content: string;
}

export interface Response {
  uuid: Uuid;
  cms: Cms;
  type: OptionSet;
  isValidationRequired: boolean;
  dateStart?: Date;
  dateEnd?: Date;
}

export interface NoticationCrud {
  uuid: Uuid;
  cms: { uuid: Uuid };
  type: OptionSet;
  isValidationRequired: boolean;
  dateStart?: Date;
  dateEnd?: Date;
}

export interface NotificationUserExternal {
  uuid: Uuid;
  user: Uuid;
  notification: { uuid: Uuid };
  isEnabled: boolean;
}

export interface I18nValue {
  title?: string;
  name: string;
  language: { name: string };
}

export interface Translation {
  uuid: Uuid;
  isHtml: boolean;
  i18nValue: I18nValue[];
}

export interface Context {
  id: string;
  instance: string;
}

export type NotifOut = NoticationCrud & {
  NotificationUserExternal?: NotificationUserExternal[];
};
