import { FilterAttribute } from "@nexys/fetchr/dist/type";
import { Uuid } from "@nexys/utils/dist/types";

export interface Profile {
  uuid: Uuid;
  instance: { uuid: Uuid };
}

export interface ProjectionConstraint {
  attribute: string;
}

export interface FilterConstraint extends ProjectionConstraint {
  filterAttribute: FilterAttribute;
}

export interface DataConstraint extends ProjectionConstraint {
  dataAttribute: FilterAttribute;
}

export interface QueryConstraint {
  filterConstraintsMap: Map<string, FilterConstraint[]>;
  projectionConstraintsMap: Map<string, ProjectionConstraint[]>;
}

export interface MutateConstraint {
  filterConstraintsMap: Map<string, FilterConstraint[]>;
  dataConstraintsMap: Map<string, DataConstraint[]>;
  append: Object;
}
export interface Constraint {
  data: QueryConstraint;
  mutate: MutateConstraint;
}
