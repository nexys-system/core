import fs, { promises as fsp } from "fs";
import * as NexysService from "../nexys-service";

interface I18nValues {
  [k: string]: string;
}

interface Options {
  local: boolean ,
  languages: string[],
  path: string
}

class I18nService {
  appToken: string;

  local:boolean;
  languages: string[];
  path: string;

  constructor(
    appToken: string,
    options: Partial<Options> = {}
  ) {
    this.appToken = appToken;
    this.local = options.local || false;
    this.languages = options.languages || ["en"];
    this.path = options.path = "./locales";
  }

  getExport = async (_lang: string): Promise<I18nValues> =>
    NexysService.request("/i18n/get", {}, this.appToken);

  get = async (lang: string) => {
    if (this.languages.includes(lang)) {
      return this.getExport(lang);
    }
  };

  getFile = async (lang: string): Promise<I18nValues> => {
    try {
      const t = await fsp.readFile(`${this.path}/${lang}.json`, "utf-8");
      return JSON.parse(t);
    } catch (err) {
      throw Error(`i18n: could not read or parse the file for ${lang}`)
    }
  };

  saveToFile = async (locale: string, messages: I18nValues):Promise<string> => {
    try {
      const json = JSON.stringify(messages);
      const path = `${this.path}/${locale}.json`;
      await fsp.writeFile(path, json, "utf8");
      console.log(`i18n: ${path} saved`);
      return locale;
    } catch (err) {
      if (err) console.error(err);
    }
  }

  /**
   * saves all files locally at `this.path`
   * @return list of saved languages
   */
  saveAll = async ():Promise<string[]> => {
    const folderExists: boolean = fs.existsSync(this.path);
    if (!exists) {
      throw Error(`i18n: the path "${this.path}", does not exist, it needs to be created`);
    }
    // here map is needed so it can be wrapped in a promise.
    const p = this.languages.map(async (lang) => {
      const messages = await this.getExport(lang);
      return await this.saveToFile(lang, messages);
    });

    return Promise.all(p);
  }

  async init() {
    if (this.local) {
      const exists = fs.existsSync(`${this.path}/en.json`);
      if (!exists) {
        await this.saveAll();
      }

      return;
    }

    await this.saveAll();
  }
}

export default I18nService;
