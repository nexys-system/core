import * as WorkflowService from "../index";

import * as StateService from "../state";

import * as RequestService from "../../api/request-service";

import {
  WorkflowState,
  TransitionInput,
  Transition,
  Node,
  ActionInput,
  TransitionState,
} from "../types";

import HTTP from "@nexys/http";
import { WorkflowInstance } from "../../workflow/type";
import { Context } from "../../../context/type";

/**
 * list outgoing transitions from node
 * @param transitions all workflow transitions
 * @param node
 * @return list of transitions
 */
export const listOutgoing = async (
  transitions: Transition[] = [],
  node?: { uuid: string }
): Promise<Transition[]> => {
  // TODO: map to transition?
  return transitions.filter(({ nodeStart }) => {
    // NOTE: init transitions do not have a start node
    return (
      (!nodeStart && !node) ||
      (nodeStart &&
        node &&
        nodeStart.uuid &&
        node.uuid &&
        nodeStart.uuid === node.uuid)
    );
  });
};

/**
 * list outgoing transitions from node
 * @param instance workflow instance
 * @return list of transitions
 */
const listForNode = async (
  node: Node,
  context: Context
): Promise<Transition[]> => {
  if (!node.workflow.uuid) {
    throw Error("uuid was not existent");
  }

  const workflow = await WorkflowService.find(node.workflow.uuid, context);
  return await listOutgoing(workflow.transitions, node);
};

/**
 * list transitions at a specified state of workflow instance
 * @param instance workflow instance
 * @param state may be null
 * @return list of transitions
 */
const listForState = async (
  instance: WorkflowInstance,
  state: WorkflowState<any> | undefined,
  context: Context
): Promise<Transition[]> => {
  if (!instance.workflow.uuid) {
    throw Error("uuid was not existent");
  }

  const workflow = await WorkflowService.find(instance.workflow.uuid, context);
  console.log(workflow);

  const startNode: Node | undefined = state && state.node;
  return await listOutgoing(workflow.transitions, startNode);
};

/**
 * list transitions at current state of workflow instance
 * @param instance workflow instance
 * @return list of transitions
 */
export const listForInstance = async (
  instance: WorkflowInstance,
  context: Context
): Promise<Transition[]> => {
  const state = await StateService.getLatest(
    instance.uuid,
    context.instance.uuid
  );
  return listForState(instance, state, context);
};

const getPrevState = async <A>(
  instance: WorkflowInstance,
  context: Context
): Promise<WorkflowState<A> | undefined> => {
  try {
    const state = await StateService.getLatest<A>(
      instance.uuid,
      context.instance.uuid
    );
    return state;
  } catch (err) {
    return undefined;
  }
};

/**
 * retrieve a transition from context and perform step in workflow
 * @param instance workflow instance
 * @param input transition that takes to next node {data, params, headers, query}
 * @return transition state
 */
export const findAndExec = async <A>(
  instance: WorkflowInstance,
  input: TransitionInput,
  context: Context
): Promise<TransitionState<A>> => {
  // NOTE: fetch state
  const prevState: WorkflowState<A> | undefined = await getPrevState(
    instance,
    context
  );
  const prevStateData = (prevState && prevState.data) || {};

  // NOTE: find transition
  const allowedTransitions = await listForState(instance, prevState, context);
  const transition = allowedTransitions.find(({ uuid }) => uuid === input.uuid);
  if (!transition) {
    throw new HTTP.Error({
      error: `The transition ${input.uuid} could not be found`,
    });
  }

  // NOTE: input for transition action
  const { data, params, headers, query } = input;
  const actionInput: ActionInput = { data, params, headers, query };

  return await exec(instance, transition, prevStateData, actionInput, context);
};

/**
 * execute a transition
 * @param workflow workflow instance
 * @param transition transition to execute
 * @param stateData data of previous state
 * @param input input for action contained in transition
 * @param implicit if transition is executed from an implicit node (no additional constraint check)
 * @return state of executed transition
 */
export const exec = async <A>(
  instance: WorkflowInstance,
  transition: Transition,
  stateData: any,
  input: ActionInput,
  context: Context,
  _implicit: boolean = false
): Promise<TransitionState<A>> => {
  let data = Object.assign({}, stateData, input.data);

  //const { params, headers, query } = input;
  //const actionInput: ActionInput = { data, params, headers, query };
  const { uuid, nodeEnd } = transition;

  let result: any = null;

  console.info(
    `Transition does not contain an action, but filled state with input: ${JSON.stringify(
      input.data
    )}`
  );

  // NOTE: $array or $text should be mapped to property in request mapping out
  if (
    result &&
    typeof result.body === "object" &&
    !Array.isArray(result.body)
  ) {
    // NOTE: modify state data with data returned from chain
    data = {
      ...data,
      ...result.body,
    };
  }

  const message: string = `Transition ${uuid} of workflow instance ${instance.uuid} executed.`;
  console.info(message);

  if (transition.request) {
    let data = Object.assign({}, stateData, input.data);

    const { params, headers, query } = input;
    const actionInput: ActionInput = { data, params, headers, query };

    // TODO: handle response headers?
    console.log("[todo] fire request");
    result = await RequestService.findAndExec(
      transition.request.uuid,
      actionInput,
      context
    );
  }

  // NOTE: insert new state with modified data, TODO: use cache
  await StateService.insert(nodeEnd.uuid, instance.uuid, data);
  const state = await StateService.getLatest<A>(
    instance.uuid,
    context.instance.uuid
  );

  if (!state) {
    throw Error("state non existent");
  }

  return await execNext<A>(instance, state, message, context);
};

/**
 * decide what's next after a transition
 * - if end node is implicit choose next transition
 * - if end node is event driven and outgoing transitions have events attached -> schedule events
 * @param workflow workflow instance
 * @param state state of instance after transition
 * @param message execution message
 * @return state of executed (next) transition
 */
const execNext = async <A>(
  _instance: WorkflowInstance,
  state: WorkflowState<A>,
  message: string,
  context: any
): Promise<TransitionState<A>> => {
  const transitions = await listForNode(state.node, context);

  return { message, state, transitions };
};
