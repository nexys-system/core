import * as TransitionService from "../transition";
import * as StateService from "../state";

import { OptionSet, WorkflowState } from "../types";

import { WorkflowInstance } from "../../workflow/type";

import { Uuid } from "@nexys/utils/dist/types";
import { Context } from "../../../context/type";
import { request } from "../../nexys-service";

export const insert = async (
  workflow: string,
  { appToken, instance }: Context
): Promise<OptionSet> =>
  request<{ workflow: string; instance: { uuid: Uuid } }>(
    "/workflow/instance/insert",
    { workflow, instance },
    appToken
  );

/**
 * fetches one workflow instance
 * @param workflow uuid of the workflow instance
 */
export const detail = async (
  uuid: string,
  { appToken }: Context
): Promise<WorkflowInstance> =>
  request<{ uuid: Uuid }>("/workflow/instance/detail", { uuid }, appToken);

export const list = async (
  workflow: { uuid: Uuid },
  { instance, appToken }: Context
) =>
  request<{ workflow: { uuid: Uuid }; instance: { uuid: Uuid } }>(
    "/workflow/instance/list",
    { workflow, instance },
    appToken
  );

export const getState = async <A>(
  uuid: string,
  context: Context
): Promise<WorkflowState<A>> => {
  const state: WorkflowState<A> = await StateService.getLatest(uuid, context);

  /*if (!state) {
    throw Error('state empy')
  }*/

  const workflowInstance: WorkflowInstance = await getWorkflowInstance(
    uuid,
    state,
    context
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

/**
 * this is  a hack because of not well written getStat
 * @param state
 */
const getWorkflowInstance = async (
  uuid: string,
  state: any | null,
  context: Context
): Promise<WorkflowInstance> => {
  if (state === null) {
    return await detail(uuid, context);
  }

  return state.workflowInstance as WorkflowInstance;
};
