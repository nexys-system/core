type Uuid = string;

import ProductService from "../product/service";
import {
  TransitionInput,
  WorkflowInstance,
  WorkflowState,
  WorkflowStep,
  Crud as CT,
} from "./type";

export default class WorkflowService extends ProductService {
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
    // TODO: headers, query
    const payload = { uuid: workflowUuid, transition };
    return await this.request("/workflow/init", payload, "POST");
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
  ): Promise<WorkflowStep<A>> {
    // TODO: headers, query
    const payload = {
      uuid: workflowInstanceUuid,
      transition,
    };

    return await this.request("/workflow/step", payload, "POST");
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
    const payload = { uuid: workflowInstanceUuid };
    return this.request("/workflow/state", payload, "POST");
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
