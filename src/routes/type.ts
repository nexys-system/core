import { Uuid } from "@nexys/utils/dist/types";

export interface CMSService {
  get: (uuid: Uuid, lang: string) => any;
}

//
export interface I18nService {
  saveAll: (cache?: boolean) => Promise<void>;
  getFile: (locale: string) => Promise<string>;
  getLanguages: () => Promise<any>;
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

// or
/*
abstract class I18nService {
  abstract saveAll: (cache?: boolean) => Promise<void>;
  abstract getFile: (locale: string) => Promise<string>;
  abstract getLanguages: () => Promise<any>;
}
*/
