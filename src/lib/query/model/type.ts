export interface Field {
  name: string;
  type: string;
  optional: boolean;
  options?: any[];
  column?: string;
}

export interface Entity {
  name: string;
  table?: string;
  uuid: boolean;
  fields: Field[];
}
