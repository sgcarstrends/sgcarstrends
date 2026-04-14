import { describe, expect, it } from "vitest";
import { start } from "workflow/api";
import { testCalculateWorkflow } from "./test-workflow";

describe("workflow integration", () => {
  it("should start a workflow and receive a run ID", async () => {
    const run = await start(testCalculateWorkflow, [{ a: 3, b: 5 }]);

    expect(run.runId).toMatch(/^wrun_/);
  });

  it("should execute steps and return the final value", async () => {
    const run = await start(testCalculateWorkflow, [{ a: 3, b: 5 }]);
    const result = await run.returnValue;

    expect(result).toEqual({ sum: 8, doubled: 16 });
  });

  it("should report completed status after workflow finishes", async () => {
    const run = await start(testCalculateWorkflow, [{ a: 10, b: 20 }]);

    await run.returnValue;
    const status = await run.status;

    expect(status).toBe("completed");
  });
});
