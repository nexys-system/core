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

const host = "https://query.nexys.io";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0YW5jZSI6IjM3M2FiN2Q0LTU3YTctMTFlOS04MzFmLTQyMDEwYTg0MDA4MCIsImluc3RhbmNlTmFtZSI6Ik5leHlzIiwicHJvZHVjdCI6MywicHJvZHVjdE5hbWUiOiJEaWdpcyIsImVudiI6MSwiZW52TmFtZSI6ImRldiIsInN1YiI6IkRpZ2lzX2RldiIsImlzcyI6Imhvc3QiLCJhdWQiOiJkZXZpY2VUeXBlIiwiaWF0IjoxNTYyMDc1NTY5OTk1fQ.WmbNnpcdnZ4590foZdFIVs7n2vu6FrGMIMBiMjjffq4";

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

export const detail = async (
  entity: string,
  uuid: string,
  projection: QueryProjection
) => {
  const params: QueryParams = { projection, filters: { uuid } };

  return find(entity, params);
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
