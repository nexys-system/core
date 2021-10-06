type Uuid = string;

import ProductService from "../product/service";
import { TransitionInput, WorkflowInstance, Crud as CT } from "./type";

import { WorkflowState } from "../workflow-service/types";

import * as WorkflowService from "../workflow-service/index";
import * as WorkflowTransitionService from "../workflow-service/transition";
import * as WorkflowInstanceService from "../workflow-service/instance";

import { TransitionState } from "../workflow-service/types";
import { Context } from "../../context/type";

export default class WorkflowService2 extends ProductService {
  context: Context;
  constructor(host: string, authToken: string, context: Context) {
    super(host, authToken);

    this.context = context;
  }

  /**
   * init workflow
   * @param workflow
   * @param transition: transition input
   * @return workflow instance | transition state
   */
  async init(
    workflowUuid: string,
    transition?: TransitionInput
  ): Promise<WorkflowInstance> {
    const workflowInstance = await WorkflowService.findAndInit(
      workflowUuid,
      this.context
    );

    if (transition) {
      const transitionInput = { ...transition };
      await WorkflowTransitionService.findAndExec(
        workflowInstance,
        transitionInput,
        this.context
      );
    }

    try {
      return workflowInstance;
    } catch (err) {
      console.error(err);
      throw Error("could not init workflow");
    }
  }

  /**
   * move workflow instance a step ahead in the workflow
   * @param workflowInstance
   * @param transition: transition input
   * @return transition state
   */
  async step<A = any>(
    workflowInstanceUuid: string,
    transition: TransitionInput
  ): Promise<TransitionState<A>> {
    const workflowInstance = await WorkflowInstanceService.detail(
      workflowInstanceUuid
    );
    const transitionInput = { ...transition };

    return WorkflowTransitionService.findAndExec<A>(
      workflowInstance,
      transitionInput,
      this.context
    );
  }

  /**
   * get state of workflow instance
   * @param workflowInstance
   * @param transition
   * @return workflow state with next transitions
   */
  async state<A = any>(
    workflowInstanceUuid: string
  ): Promise<WorkflowState<A>> {
    return await WorkflowInstanceService.getState<A>(
      workflowInstanceUuid,
      this.context
    );
  }

  /**
   *
   * @param workflowUuid : workflow UUID
   * @returns list of instances of a particular workflow
   */
  instanceList = async (workflowUuid: Uuid): Promise<CT.WorkflowInstance[]> =>
    this.request("/workflow/instance/list", { uuid: workflowUuid }, "POST");

  /**
   *
   * @param workflowInstanceUuid : workflowInstance uuid
   * @returns list of states linked with a workflow instance
   */
  instanceStates = async (
    workflowInstanceUuid: Uuid
  ): Promise<CT.WorkflowState[]> =>
    this.request(
      "/workflow/instance/log/list",
      { uuid: workflowInstanceUuid },
      "POST"
    );
}
