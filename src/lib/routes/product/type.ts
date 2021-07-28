import { Uuid } from "@nexys/utils/dist/types";
import I18nService from "../../services/i18n";

export interface CMSService {
  get: (uuid: Uuid, lang: string) => any;
}

export interface NotificationService {
  list: (types?: string[], lang?: string) => any;
}

export interface EmailService {
  send: (email: string[], subject: string, body: string) => Promise<any>;
}

export interface ProductService {
  I18n: I18nService;
  CMS: CMSService;
  Notification: NotificationService;
  Email: EmailService;
}
