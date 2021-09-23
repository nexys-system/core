import Utils from "@nexys/utils";

import * as NexysQueryService from "../../../../nexys/nexys";
import {
  WorkflowState,
  OptionSet,
  TransitionStateCrud,
  TransitionStateCrudOut,
} from "../types";

import { Uuid } from "@nexys/utils/dist/types";
import { QueryParams } from "@nexys/fetchr/dist/type";
import { Context } from "../../../../nexys/context";

// TODO: solve with cache

const format = <A>(result: any): WorkflowState<A> => {
  const { uuid, workflowInstance, node, data } = result;

  // NOTE: return state with deserialized data
  const state: WorkflowState<A> = {
    uuid,
    workflowInstance,
    node,
    data: JSON.parse(data),
  };

  return state;
};

/**
 * inserts workflow instance state
 */
export const insert = async (
  node: string,
  workflowInstance: string,
  data: any = {},
  comment?: string
): Promise<OptionSet> => {
  // NOTE: query engine accepts non-nested uuids as foreign keys
  const payload: any = {
    node,
    workflowInstance,
    data: JSON.stringify(data),
    comment,
    secretKey: Utils.random.generateString(50),
    logDateAdded: new Date(),
  };

  // TODO: insert state into persistent cache, periodically write into db
  return await NexysQueryService.insert("WorkflowState", payload);
};

/**
 * get latest state of the workflow (instance) => get from cache
 */

const getParams = (
  workflowInstanceUuid: Uuid,
  instanceUuid: Uuid
): QueryParams => ({
  filters: {
    workflowInstance: {
      uuid: workflowInstanceUuid,
      instance: { uuid: instanceUuid },
    },
  },
  projection: {
    workflowInstance: {
      instance: false,
      logUser: false,
    },
    node: {
      instance: false,
    },
    secretKey: false,
    logDateAdded: false,
  },
  order: {
    by: "logDateAdded",
    desc: true,
  },
});

/**
 * get latest state of the workflow (instance) => get from cache
 */
export const getLatest = async <A>(
  workflowInstanceUuid: Uuid,
  instanceUuid: Uuid
): Promise<WorkflowState<A>> => {
  const params = getParams(workflowInstanceUuid, instanceUuid);

  const result = await NexysQueryService.find("WorkflowState", params, true);

  if (!result) {
    throw Error("could not find transition state");
  }

  return format(result);
};

export const list = async (
  workflowInstanceUuid: Uuid,
  { instance }: Context
): Promise<WorkflowState<any>[]> => {
  const params = getParams(workflowInstanceUuid, instance.uuid);

  const result: TransitionStateCrudOut[] = await NexysQueryService.list(
    "WorkflowState",
    params
  );

  return result.map((x) => format(x));
};
