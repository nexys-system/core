import * as TransitionService from "../transition";
import * as StateService from "../state";

import * as NexysQueryService from "../../../../nexys/nexys-qs";

import { OptionSet, WorkflowState } from "../types";

import { WorkflowInstance } from "../../workflow/type";

import { Uuid } from "@nexys/utils/dist/types";
import { Context } from "../../../context/type";

const entity = "WorkflowInstance";

export const insert = async (
  workflow: string,
  context: Context
): Promise<OptionSet> => {
  const data: any = {
    instance: { uuid: context.instance.uuid }, // NOTE: digis instance
    workflow: { uuid: workflow },
    // logUser, // TODO: app-token is not a user (logUser should be optional)
    logDateAdded: new Date(),
  };

  return await NexysQueryService.insert(entity, data);
};

/**
 * fetches one workflow instance
 * @param workflow uuid of the workflow instance
 */
export const detail = async (uuid: string): Promise<WorkflowInstance> => {
  const projection = {
    workflow: {
      instance: false,
      product: false,
    },
    instance: false,
    logUser: false,
  };

  const result: any = await NexysQueryService.detail(entity, uuid, projection);

  const instance: WorkflowInstance = { ...result };
  return instance;
};

export const list = async (workflow: { uuid: Uuid }, { instance }: Context) =>
  NexysQueryService.list(entity, {
    projection: { uuid: true, logDateAdded: true },
    filters: {
      workflow,
      instance: { uuid: instance },
    },
    order: { by: "logDateAdded", desc: true },
  });

/**
 * this is  a hack because of not well written getStat
 * @param state
 */
const getWorkflowInstance = async (
  uuid: string,
  state: any | null
): Promise<WorkflowInstance> => {
  if (state === null) {
    return await detail(uuid);
  }

  return state.workflowInstance as WorkflowInstance;
};

export const getState = async <A>(
  uuid: string,
  context: Context
): Promise<WorkflowState<A>> => {
  const state: WorkflowState<A> = await StateService.getLatest(
    uuid,
    context.instance.uuid
  );

  /*if (!state) {
    throw Error('state empy')
  }*/

  const workflowInstance: WorkflowInstance = await getWorkflowInstance(
    uuid,
    state
  );
  const transitions = await TransitionService.listForInstance(
    workflowInstance,
    context
  );

  return {
    ...state,
    transitions,
  };
};
