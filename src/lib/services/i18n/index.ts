import fs, { promises as fsp } from "fs";
import * as NexysService from "../nexys-service";

interface I18nValues {
  [k: string]: string;
}

class I18nService {
  appToken: string;
  local: boolean;
  path: string;
  languages: string[];
  constructor(
    appToken: string,
    local: boolean = false,
    path: string = "./locales"
  ) {
    this.appToken = appToken;
    this.local = local;
    this.path = path; // process.cwd()

    this.languages = ["en"];
  }

  getExport = async (lang: string): Promise<I18nValues> =>
    NexysService.request("/i18n/get", {}, this.appToken);

  get = async (lang: string) => {
    if (this.languages.includes(lang)) {
      return this.getExport(lang);
    }
  };

  getFile = async (lang: string): Promise<I18nValues> => {
    const t = await fsp.readFile(`${this.path}/${lang}.json`, "utf-8");
    return JSON.parse(t);
  };

  async saveToFile(locale: string, messages: I18nValues) {
    try {
      const json = JSON.stringify(messages);
      const path = `${this.path}/${locale}.json`;
      await fsp.writeFile(path, json, "utf8");
      console.log(`${path} saved`);
    } catch (err) {
      if (err) console.error(err);
    }
  }

  /**
   * saves all files locally at `this.path`
   */
  async saveAll(cache: boolean = false) {
    const exists: boolean = fs.existsSync(this.path);
    if (exists) {
      this.languages.forEach(async (lang) => {
        if (!cache) {
          const messages = await this.getExport(lang);
          await this.saveToFile(lang, messages);
        }
      });
    }
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
