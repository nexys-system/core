export interface Field {
  name: string;
  type: string;
  optional: boolean;
  options?: any[];
}

export interface Entity {
  name: string;
  uuid: boolean;
  fields: Field[];
}
