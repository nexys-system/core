import { Uuid } from "@nexys/utils/dist/types";
import { WorkflowState, OptionSet } from "../types";
import { Context } from "../../../context/type";
import { request } from "../../nexys-service";

/**
 * inserts workflow instance state
 */
export const insert = async (
  node: string,
  workflowInstance: string,
  { appToken }: Pick<Context, "appToken">,
  data: any = {},
  comment?: string
): Promise<OptionSet> =>
  request<
    { node: string; workflowInstance: string; data: any; comment?: string },
    OptionSet
  >(
    "/workflow/state/insert",
    { node, workflowInstance, data, comment },
    appToken
  );

/**
 * get latest state of the workflow (instance) => get from cache
 */
export const getLatest = async <A>(
  workflowInstanceUuid: Uuid,
  { appToken, instance }: Pick<Context, "appToken" | "instance">
): Promise<WorkflowState<A>> =>
  request<
    { workflowInstanceUuid: string; instanceUuid: string },
    WorkflowState<A>
  >(
    "/workflow/state/getLatest",
    { workflowInstanceUuid, instanceUuid: instance.uuid },
    appToken
  );

export const list = async (
  workflowInstanceUuid: Uuid,
  { instance, appToken }: Pick<Context, "instance" | "appToken">
): Promise<WorkflowState<any>[]> =>
  request<
    { workflowInstanceUuid: string; instanceUuid: string },
    WorkflowState<any>[]
  >(
    "/workflow/state/list",
    { workflowInstanceUuid, instanceUuid: instance.uuid },
    appToken
  );
