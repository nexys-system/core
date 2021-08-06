import nock from "nock";
import WorkflowService from "./service";

const Workflow = new WorkflowService("https://flow.digis.io", "token");

describe("init", () => {
  const uuid = "test";
  const workflow = { uuid };

  test("with nock", async () => {
    nock("https://flow.digis.io").post("/workflow/init").reply(200, workflow);

    const result = await Workflow.init(uuid);
    expect(result).toEqual(workflow);
  });
});

describe("step", () => {
  test("with nock", async () => {
    const workflowInstance = "uuid1";
    const transition = { uuid: "uuid2" };

    const data = {
      message: `transition ${transition} of workflow ${workflowInstance} executed`,
      state: {},
      next: {
        message: "...",
        state: {},
      },
    };

    nock("https://flow.digis.io").post("/workflow/step").reply(200, data);

    const result = await Workflow.step(workflowInstance, transition);
    expect(result).toEqual(data);
  });
});

// TODO: getState()
