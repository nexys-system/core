import { Uuid } from "@nexys/utils/dist/types";
import { QueryService } from "./type";
import * as U from "./utils";
import * as CT from "./crud-type";

export default class Instance {
  qs: QueryService;

  constructor(qs: QueryService) {
    this.qs = qs;
  }

  // general permissions (no conditions, superadmin functionalities)
  list = async () => this.qs.list<CT.Instance>(U.Entity.Instance);

  detail = async (uuid: Uuid) =>
    this.qs.detail<CT.Instance>(U.Entity.Instance, uuid);

  exists = async (name: string) =>
    this.qs.find<CT.Instance>(U.Entity.Instance, { filters: { name } });

  insert = async (name: string) => {
    const row: Omit<CT.Instance, "uuid"> = { name, dateAdded: new Date() };

    const r = await this.qs.insertUuid<CT.Instance>(U.Entity.Instance, row);

    return { uuid: r.uuid };
  };

  update = async (uuid: Uuid, name: string): Promise<boolean> => {
    const r = await this.qs.update<CT.Instance>(
      U.Entity.Instance,
      { uuid },
      { name }
    );

    return r.success;
  };

  delete = async (uuid: Uuid): Promise<boolean> => {
    const r = await this.qs.delete(U.Entity.Instance, { uuid });

    return r.success;
  };
}
