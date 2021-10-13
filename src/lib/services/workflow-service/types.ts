export interface ActionInput {
  data: any;
  params?: any;
  headers?: any;
  query?: any;
}

import { Uuid } from "@nexys/utils/dist/types";

export interface OptionSet {
  uuid?: Uuid;
  id?: number;
  name?: string;
}

export interface TransitionInput extends Omit<ActionInput, "data"> {
  uuid: Uuid;
  data?: any;
}

export enum ConstraintType {
  eq, // equal
  gt, // >: greater than
  get, // >=: great  or equal than
  lt, // < less than
  lte, // <= less or equal
  regex,
  boolean,
}

export interface TransitionConstraint {
  type: ConstraintType;
  name: string;
  value: number | string;
  errorMsg?: string;
}

export interface Transition {
  uuid: Uuid;
  constraints?: TransitionConstraint[];
  event?: any;
  nodeStart?: Node;
  nodeEnd: Node;
  chain?: any;
  request?: any;
  snippet?: any;
}

export interface TransitionState<A> {
  message: string;
  state: WorkflowState<A>;
  transitions?: Transition[];
  events?: any[];
  error?: any;
}

export interface Node {
  uuid: Uuid;
  name: string;
  workflow: { uuid: Uuid }; //; name: string };
  isEventDriven: boolean;
}

export interface Workflow {
  uuid: Uuid;
  name: string;
  transitions?: Transition[];
}

export interface WorkflowInstance {
  uuid: Uuid;
  workflow: { uuid: Uuid; name: string };
  logDateAdded: Date;
}

export interface WorkflowState<A> {
  uuid?: string;
  node: Node;
  workflowInstance: WorkflowInstance;
  data: A;
  transitions?: Transition[];
}

export interface TransitionStateCrud {
  uuid: Uuid;
  node: { uuid: Uuid };
  workflowInstance: { uuid: Uuid };
  data: string;
  comment?: string;
  secretKey: string;
  logDateAdded: Date;
}

export interface TransitionStateCrudOut {
  uuid: Uuid;
  workflowInstance: WorkflowInstance;
  node: Node;
  data: string;
}
