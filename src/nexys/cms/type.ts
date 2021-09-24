import { Uuid } from "@nexys/utils/dist/types";

export interface Core {
  uuid: Uuid;
  key: string;
  isHtml: boolean;
}

export interface LangValues {
  [lang: string]: { content: string; title: string };
}
