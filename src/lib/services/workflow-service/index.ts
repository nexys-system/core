// NOTE: What is a workflow? https://www.process.st/what-is-a-workflow/
// NOTE: keep tabs on apache airflow
import { HTTP } from "@nexys/lib";
import { Uuid } from "@nexys/utils/dist/types";

import { Context } from "../../../nexys/context";
import * as InstanceService from "./instance";

/**
 * find workflow
 * @params uuid
 */
export const find = (uuid: Uuid, context: Context) => {
  const workflows = context.workflow || [];
  const workflow = workflows.find((workflow) => workflow.uuid === uuid);

  console.log(context.workflow?.length);

  if (!workflow) {
    throw new HTTP.Error({ error: "The workflow could not be found" });
  }

  return workflow;
};

/**
 * init workflow
 * @params uuid
 */
export const init = async (uuid: Uuid, context: Context) => {
  const instance = await InstanceService.insert(uuid, context);

  if (!instance.uuid) {
    throw Error("uuid could not be found");
  }

  return InstanceService.detail(instance.uuid);
};

/**
 * find and init workflow
 * @params uuid
 */
export const findAndInit = async (uuid: string, context: Context) => {
  const workflow = await find(uuid, context);
  try {
    return init(workflow.uuid, context);
  } catch (err) {
    throw err;
  }
};
