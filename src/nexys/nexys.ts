import {
  QueryParams,
  Query,
  Mutate,
  QueryProjection,
  MutateResponseInsert,
} from "@nexys/fetchr/dist/type";
import fetch from "node-fetch";
import https from "https";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const host = process.env.NEXYS_HOST;
const token = process.env.NEXYS_TOKEN;

if (host === undefined) {
  throw Error("NEXYS HOST not defined");
}

if (token === undefined) {
  throw Error("NEXYS TOKEN not defined");
}

const request = async (urlpath: string, payload: any) => {
  const url = host + urlpath;
  const body = JSON.stringify(payload);
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: token,
    },
    agent: httpsAgent,
    body,
  };
  const r = await fetch(url, options);

  console.log(r.status);

  return r.json();
};

export const getQuery = async <A>(
  q: Query
): Promise<{ [entity: string]: A[] }> => {
  return request("/data", q);
};

export const getMutate = async (
  q: Mutate
): Promise<{
  [entity: string]: { insert: { uuid: any; success: boolean } };
}> => {
  console.log("mutate");
  console.log(JSON.stringify(q));
  //return "" as any;
  const r = await request("/mutate", q);
  console.log(r);
  return r;
};

export const list = async <A>(
  entity: string,
  params: QueryParams
): Promise<A[]> => {
  const query = { [entity]: params };

  const r = await getQuery<A>(query);

  return r[entity];
};

export const find = async <A>(
  entity: string,
  params: QueryParams,
  isOptional: boolean = false
): Promise<A | null> => {
  const l = await list<A>(entity, params);
  if (l.length > 0) {
    return l[0];
  }

  return null;
};

export const detail = async <A>(
  entity: string,
  uuid: string,
  projection: QueryProjection,
  references?: any
) => {
  const params: QueryParams = { projection, filters: { uuid }, references };

  return find<A>(entity, params);
};

export const insert = async <Id>(
  entity: string,
  payload: any
): Promise<MutateResponseInsert> => {
  const query: Mutate = { [entity]: { insert: { data: payload } } };

  const r = await getMutate(query);

  const ids = r[entity].insert;

  return ids;
};
