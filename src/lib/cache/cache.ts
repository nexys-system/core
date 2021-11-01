import Utils from "@nexys/utils";

abstract class Cache {
  path: string | undefined;

  constructor(path: string | undefined = undefined) {
    this.path = path; // NOTE: path for handling nested data
  }

  getId(length: number): string {
    return Utils.random.generateString(length);
  }

  serialize<A = any>(data: A): A {
    if (this.path) {
      return Utils.ds.get(this.path, data);
    } else return data;
  }

  deserialize<A = any>(data: A): A {
    if (this.path) {
      return Utils.ds.nest({ [this.path]: data });
    } else return data;
  }

  get<A = any>(_key: string): A {
    throw new Error("Cache getter not implemented");
  }

  async set<A = any>(
    _key: string,
    _value: A,
    _ttl: number | undefined = undefined
  ): Promise<any> {
    throw new Error("Cache setter not implemented");
  }

  extend(key: string, value: any) {
    const entry = this.get(key);
    if (entry) {
      const newValue = { ...entry, ...value };
      return this.set(key, newValue);
    } else return false;
  }

  destroy(_key: string) {
    throw new Error("Cache destroyer not implemented");
  }
}

export default Cache;
