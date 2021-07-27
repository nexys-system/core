import { Uuid } from "@nexys/utils/dist/types";
import { QueryService } from "../type";
import * as U from "../utils";
import * as CT from "../crud-type";

export default class UserAuthentication {
  qs: QueryService;

  constructor(qs: QueryService) {
    this.qs = qs;
  }

  list = async ({ uuid }: { uuid: Uuid }): Promise<CT.UserAuthentication[]> => {
    const r = await this.qs.list<CT.UserAuthentication>(
      U.Entity.UserAuthentication,
      {
        filters: { user: { uuid } },
      }
    );

    return r;
  };

  detail = async (uuid: Uuid): Promise<CT.UserAuthentication> => {
    const r = await this.qs.detail<CT.UserAuthentication>(
      U.Entity.UserAuthentication,
      uuid
    );

    return r;
  };

  insert = async (
    row: Omit<CT.UserAuthentication, "uuid">
  ): Promise<{ uuid: Uuid }> => {
    console.log(row);
    const r = await this.qs.insertUuid(U.Entity.UserAuthentication, row);

    return { uuid: r.uuid };
  };

  update = async (
    uuid: Uuid,
    row: Partial<CT.UserAuthentication>
  ): Promise<{ success: boolean }> => {
    const r = await this.qs.update(U.Entity.UserAuthentication, { uuid }, row);

    return r;
  };

  delete = async (uuid: Uuid): Promise<boolean> => {
    const r = await this.qs.delete(U.Entity.UserAuthentication, { uuid });

    return r.success;
  };
}
