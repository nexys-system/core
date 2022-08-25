import QueryService from "../../query/abstract-service";
import * as U from "../utils";
import * as CT from "../crud-type";
import { hashPassword } from "../password/utils";

type Uuid = string;

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

  insert = async ({
    value: preValue,
    isEnabled,
    type,
    user,
  }: Omit<CT.UserAuthentication, "uuid">): Promise<{ uuid: Uuid }> => {
    const value: string =
      CT.AuthenticationType.password === type
        ? await hashPassword(preValue)
        : preValue;

    const r = await this.qs.insertUuid(U.Entity.UserAuthentication, {
      value,
      isEnabled,
      type,
      user,
    });

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
