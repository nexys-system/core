import { promises as fs } from "fs";
import path from "path";

import NodeCache from "node-cache";

import Cache from "./cache";

const fileExists = (path: string): Promise<boolean> =>
  fs
    .stat(path)
    .then((_) => true)
    .catch((err) => {
      if (err.code === "ENOENT") return false;
      throw err;
    });

class LocalCache extends Cache {
  cache: NodeCache;
  persistent: boolean;
  file: string;

  constructor(
    p: {
      persistent?: boolean;
      file?: string; // file where to save persistent data
      ttl?: number;
      checkperiod?: number;
    } = {},
    path?: string
  ) {
    super(path);

    const {
      persistent = false,
      file = "cache",
      ttl = 0,
      checkperiod = 600,
    } = p;

    this.cache = new NodeCache({
      stdTTL: ttl, // ttl in seconds, 0: unlimited
      checkperiod, // delete check interval in seconds, 0: no check
    });

    if (persistent) {
      // `!!`: casting to boolean
      this.persistent = !!persistent;
      this.file = file;

      // NOTE: constructor not async - https://gist.github.com/goloroden/c976971e5f42c859f64be3ad7fc6f4ed
      this.load();
    } else {
      this.persistent = false;
      this.file = "cache";
    }
  }

  async load(dir: string = process.cwd()) {
    const filePath = path.join(dir, `${this.file}.json`);
    const exists: boolean = await fileExists(filePath);
    if (exists) {
      const json = await fs.readFile(filePath, "utf8");
      if (json) {
        const data = JSON.parse(json);
        for (const [key, val] of Object.entries(data)) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            this.cache.set(key, val);
          }
        }
      }
    }
  }

  async save(dir: string = process.cwd()) {
    const keys = this.cache.keys();
    const data = this.cache.mget(keys);

    const json = JSON.stringify(data);
    const fpath = path.join(dir, `${this.file}.json`);
    await fs.writeFile(fpath, json);

    console.log(`Cache saved to file at ${fpath}`);
  }

  get<A = any>(key: string) {
    if (this.cache.has(key)) {
      const data = this.cache.get<A>(key);
      if (!data) {
        throw Error("key could not be found in cache: " + key);
      } else {
        return this.deserialize<A>(data);
      }
    } else {
      throw Error("key could not be found in cache: " + key);
    }
  }

  async set<A = any>(
    key: string,
    value: A,
    ttl: number | undefined = undefined
  ): Promise<any> {
    const data = this.serialize<A>(value);

    const result = this.cache.set<A>(key, data, ttl || 0);

    if (this.persistent) {
      await this.save();
    }

    if (result) {
      return key;
    }
    throw Error("could not set");
  }

  destroy(key: string) {
    // NOTE: supports single key or array of keys
    return this.cache.del(key);
  }
}

export default LocalCache;
