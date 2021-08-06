type Uuid = string;
interface OptionSet {
  id: number;
  name: string;
}

//https://github.com/Nexysweb/lib/issues/42
export type NotificationType = "banner" | "login" | "signup" | "other";

export interface Cms {
  uuid: Uuid;
  isHtml: boolean;
  title?: string;
  content: string;
}

export interface Out {
  uuid: Uuid;
  type: OptionSet;
  isValidationRequired: boolean;
  dateStart?: Date;
  dateEnd?: Date;
  cms: Cms;
}

export interface OutAccept {
  uuid: Uuid;
  acknowledged: boolean;
}

export interface OutPublic {
  uuid: string;
  title?: string;
  content: string;
  isValidationRequired: boolean;
}
