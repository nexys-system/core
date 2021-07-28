import HTTP from "@nexys/http";
import * as QueryUtil from "./utils";
import {
  Query,
  QueryFilters as Filters,
  Mutate,
  QueryParams as Params,
  QueryProjection as Projection,
  MutateResponse,
  MutateResponseInsert,
  References,
  MutateResponseUpdate,
  MutateResponseDelete,
} from "@nexys/fetchr/dist/type";

import * as Fetchr from "@nexys/fetchr";

import * as T from "../user-management/type";

type QueryResponse = any;

type Uuid = string;
type Id = number;

class QueryService extends T.QueryService {
  fetchr: Fetchr.default;
  constructor(f: Fetchr.default) {
    super();

    this.fetchr = f;
  }

  async data(query: Query): Promise<QueryResponse> {
    // TODO: implement references inside projection
    //return await this.request("/data", query);
    return this.fetchr.query(query);
  }

  async mutate(query: Mutate): Promise<MutateResponse> {
    /* const arr = Fetchr.QueryBuilder.Mutate.createMutateQuery(
      query,
      this.fetchr.model
    );*/
    //console.log(arr[0].sql);
    const r = await this.fetchr.mutate(query);

    return r;
  }

  insert = async <A = any>(
    entity: string,
    data: Omit<A, "uuid" | "id">
  ): Promise<{ uuid: string } | { id: number }> => {
    const query = QueryUtil.insert(entity, data);

    const response: MutateResponse = await this.mutate(query);
    if (response && response[entity]) {
      const insertResponse: MutateResponseInsert = <MutateResponseInsert>(
        response[entity].insert
      );
      if (insertResponse.success) {
        const { uuid, id } = insertResponse;
        if (uuid) {
          return { uuid };
        }
        if (id) {
          return { id };
        }

        throw new HTTP.Error(response, 400);
      }

      throw new HTTP.Error(response.status);
    }

    throw new HTTP.Error(response, 500);
  };

  insertId = <A = any>(
    entity: string,
    data: Omit<A, "id">
  ): Promise<{ id: number }> =>
    this.insert<A>(entity, data as Omit<A, "id" | "uuid">) as Promise<{
      id: Id;
    }>;

  async insertUuid<A = any>(
    entity: string,
    data: Omit<A, "uuid">
  ): Promise<{ uuid: string }> {
    return this.insert<A>(entity, data as Omit<A, "id" | "uuid">) as Promise<{
      uuid: Uuid;
    }>;
  }

  /**
   * insert multiple - wrapper around `mutate`
   * @param rows: already formatted rows (array)
   **/
  async insertMultiple<A = any>(
    entity: string,
    data: A[] = []
  ): Promise<MutateResponseInsert[]> {
    if (data.length === 0) {
      throw new HTTP.Error(`No rows for ${entity} provided`, 400);
    }

    const query = QueryUtil.insert(entity, data);
    const r = await this.mutate(query);

    if (r[entity].insert && Array.isArray(r[entity].insert)) {
      const t: MutateResponseInsert[] = r[entity]
        .insert as MutateResponseInsert[];
      return t;
    }
    console.log(JSON.stringify(data, null, 2));
    throw new HTTP.Error(
      `Something went wrong while inserting rows for ${entity} provided, see log for more information`,
      400
    );
  }

  async update<A = any>(
    entity: string,
    filters: number | string | Filters,
    data: Partial<A>
  ): Promise<MutateResponseUpdate> {
    const query: Mutate = QueryUtil.update(entity, filters, data);
    const r = await this.mutate(query);
    if (!(entity in r)) {
      throw Error("something went wrong while trying to update");
    }

    const re: { update?: MutateResponseUpdate } = r[entity];

    if (!re.update) {
      throw Error(
        "CRUD could not update, errors from https://github.com/Nexysweb/lib/blob/master/src/query/index.ts#L103"
      );
    }

    return re.update;
  }

  /**
   * this implementation of update multiple is a wrapper on top of `update` so that it can update more than one record with different filters
   * @param entity
   * @param paramsMultiple
   */
  async updateMultiple<A = any>(
    entity: string,
    paramsMultiple: { filters: number | string | Filters; data: Partial<A> }[]
  ): Promise<MutateResponseUpdate[]> {
    const r = paramsMultiple.map(
      async ({ filters, data }) => await this.update(entity, filters, data)
    );
    return Promise.all(r);
  }

  async list<A = any>(entity: string, params: Params = {}): Promise<A[]> {
    // TODO entity: only first letter uppercase?
    const data = await this.data({ [entity]: params });
    return QueryUtil.getList(data, entity);
  }

  async find<A = any>(
    entity: string,
    params: Params = {},
    optional: boolean = false
  ): Promise<A> {
    const data = await this.list(entity, params);
    return QueryUtil.getFirst(data, entity, optional);
  }

  async detail<A = any>(
    entity: string,
    id: string | number,
    projection?: Projection,
    references?: References
  ): Promise<A> {
    const filters = QueryUtil.paramsFromFilters(id);
    return await this.find(entity, { filters, projection, references });
  }

  /**
   * deletes record(s)
   * @param entity entity of interest
   * @param filters : filters
   */
  async delete(
    entity: string,
    filters: number | string | Filters
  ): Promise<MutateResponseDelete> {
    const query = QueryUtil.deleteById(entity, filters);

    const r = await this.mutate(query);

    if (!(entity in r)) {
      throw Error("something went wrong while trying to delete");
    }

    const re: { delete?: MutateResponseDelete } = r[entity];

    if (!re.delete) {
      throw Error(
        "CRUD could not delete, errors from see https://github.com/Nexysweb/lib/blob/master/src/query/index.ts#L161 "
      );
    }

    return re.delete;
  }
}

export default QueryService;