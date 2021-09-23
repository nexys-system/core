import { Uuid } from "@nexys/utils/dist/types";
import { saveContent } from "../context";
import * as NexysQueryService from "../nexys";

interface Transition {}

interface CrudOut {
  Transition?: Transition[];
}

const format = (workflow: CrudOut) => {
  if (workflow.Transition) {
    const { Transition: transitions } = workflow;

    delete workflow.Transition;
    return { ...workflow, transitions };
  } else {
    return workflow;
  }
};

export const fetch = async (context: { instance: { uuid: Uuid } }) => {
  // TODO: product
  const params = {
    projection: { name: true, uuid: true },
    filters: {
      instance: { uuid: context.instance },
    },
    references: {
      Transition: {
        projection: {
          nodeStart: {},
          nodeEnd: {},
        },
      },
    },
  };

  const result: CrudOut[] = await NexysQueryService.list<CrudOut>(
    "Workflow",
    params
  );

  const r = result.map(format);

  // save into context

  await saveContent(r, "workflow");

  return r;
};
