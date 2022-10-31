import QueryService from "../../query/abstract-service";
import * as U from "../utils";
import * as CT from "../crud-type";
import { generateString } from "@nexys/utils/dist/random";
import { UserMeta } from "../type";

type Uuid = string;

const entity = U.Entity.UserToken;

export default class UserToken {
  qs: QueryService;

  constructor(qs: QueryService) {
    this.qs = qs;
  }

  list = async ({ uuid }: { uuid: Uuid }): Promise<CT.UserToken[]> => {
    const l = await this.qs.list<CT.UserToken>(entity, {
      filters: { user: { uuid } },
    });

    return l.sort(
      (a, b) =>
        new Date(b.logDateAdded).getTime() - new Date(a.logDateAdded).getTime()
    );
  };

  detail = async (uuid: Uuid): Promise<CT.UserToken> =>
    this.qs.detail<CT.UserToken>(entity, uuid);

  create = async (userUuid: Uuid, { userAgent, ip }: UserMeta) => {
    const token = generateString(21);

    const tokenRow = {
      token,
      logDateAdded: new Date(),
      user: { uuid: userUuid },
      userAgent,
      ip,
    };

    const rToken = await this.insert(tokenRow);
    return createRefreshToken(rToken.uuid, token);
  };

  insert = async (row: Omit<CT.UserToken, "uuid">): Promise<{ uuid: Uuid }> => {
    const r = await this.qs.insertUuid(entity, row);

    return { uuid: r.uuid };
  };

  delete = async (uuid: Uuid): Promise<boolean> => {
    const r = await this.qs.delete(entity, { uuid });

    return r.success;
  };

  deleteByRefreshToken = async (
    userUuid: Uuid,
    refreshToken: string
  ): Promise<boolean> => {
    const [uuid, token] = extractTokenAndUuid(refreshToken);

    const r = await this.qs.delete(entity, {
      user: { uuid: userUuid },
      token,
      uuid,
    });
    return r.deleted > 0;
  };

  getFromRefreshToken = async (refreshToken: string): Promise<Uuid> => {
    const [uuid, token] = extractTokenAndUuid(refreshToken);
    const tokenRow = await this.detail(uuid);
    if (!(tokenRow.token === token)) {
      throw Error("could not find token");
    }

    return tokenRow.user.uuid;
  };
}

const sepCharacter = ":";

export const createRefreshToken = (uuid: Uuid, token: string) =>
  uuid + sepCharacter + token;

export const extractTokenAndUuid = (refreshToken: string) => {
  const [uuid, token] = refreshToken.split(sepCharacter);
  return [uuid, token];
};
