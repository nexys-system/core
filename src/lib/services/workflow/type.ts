type Uuid = string;
// NOTE: query parameters and headers are taken from HTTP request
export interface TransitionInput {
  uuid: Uuid;
  data?: any;
  params?: any;
}

export interface UOptionSet {
  uuid: Uuid;
  name: string;
}

export interface WorkflowInstance {
  workflow: UOptionSet;
  logDateAdded: Date;
  uuid: Uuid;
}

export type Constraint = any;

// `Node` is a reserved word
export interface WFNode {
  uuid: Uuid;
  instance: { uuid: Uuid };
  workflow: { uuid: Uuid };
  isEventDriven: boolean;
}

export interface Transition {
  snippet: null;
  request: null;
  chain: null;
  instance: { uuid: Uuid };
  workflow: { uuid: Uuid };
  name: string;
  nodeStart?: WFNode;
  event: null;
  uuid: Uuid;
  nodeEnd: WFNode;
  constraints: Constraint[];
}

export interface WorkflowState<A = any> {
  uuid?: Uuid;
  node: WFNode;
  workflowInstance: WorkflowInstance;
  data: A;
  transitions?: Transition[];
}

export interface WorkflowStep<A = any> {
  message: string;
  state: WorkflowState<A>;
  transitions: Transition[];
}

export declare module Crud {
  export interface WorkflowInstance {
    uuid: Uuid;
    workflow: {
      uuid: Uuid;
    };
    logDateAdded: Date;
  }

  export interface Node {
    uuid: Uuid;
    workflow: {
      uuid: Uuid;
    };
    name: string;
    isEventDriven: boolean;
  }

  export interface WorkflowState {
    uuid: Uuid;
    workflowInstance: WorkflowInstance;
    node: Node;
    data: any;
  }
}
