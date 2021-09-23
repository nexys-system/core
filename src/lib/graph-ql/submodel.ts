import { QueryFilters, QueryProjection } from "@nexys/fetchr/dist/type";
import { Uuid } from "@nexys/utils/dist/types";
import * as T from "./type";

export const createAdminConstraints = (def: T.Ddl[]) =>
  createConstraintsFromEntities<"Instance", string | number>(def);

export const createAppConstraint = (def: T.Ddl[]) =>
  createConstraintsFromEntities<"Instance" | "User", string | number>(def);

export const createConstraintsFromEntities =
  <ObservedEntity extends string, Id extends Uuid | number>(def: T.Ddl[]) =>
  (ids: { [key in ObservedEntity]: Id }): T.Model => {
    const r: T.Model = {};

    const entitiesOfInterest: string[] = Object.keys(ids);

    def.map((entity) => {
      const projection: QueryProjection = {};
      const filters: QueryFilters = {};

      // add projection
      entity.fields
        .filter((f) => !entitiesOfInterest.includes(f.type))
        .forEach((f) => {
          projection[f.name] = true;
        });

      // add filters - is the key a uuid or id?

      // on entity itself
      if (entitiesOfInterest.includes(entity.name)) {
        const id = ids[entity.name as ObservedEntity];
        const idKey = entity.uuid ? "uuid" : "id";
        filters[idKey] = id;
      }
      // on fk
      entity.fields
        .filter((f) => entitiesOfInterest.includes(f.type))
        .forEach((f) => {
          const id = ids[f.type as ObservedEntity];
          const fkEntity = def.find((x) => x.name === f.type);

          if (!fkEntity) {
            throw Error(
              "could not find foreign key entity when creating constraints"
            );
          }

          const idKey = fkEntity.uuid ? "uuid" : "id";
          filters[f.name] = { [idKey]: id };
        });
      // filters end

      r[entity.name] = { projection, filters };
    });

    return r;
  };
