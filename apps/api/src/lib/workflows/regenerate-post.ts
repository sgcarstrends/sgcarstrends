import {
  getCarsAggregatedByMonth,
  getCoeForMonth,
  regenerateBlogContent,
} from "@sgcarstrends/ai";
import { tokeniser } from "@sgcarstrends/utils";
import type { WorkflowContext } from "@upstash/workflow";

interface RegeneratePostPayload {
  month: string;
  dataType: "cars" | "coe";
}

export const regeneratePost = async (
  context: WorkflowContext,
  payload: RegeneratePostPayload,
) => {
  const { month, dataType } = payload;

  const data = await context.run(`Fetch ${dataType} data`, async () => {
    if (dataType === "cars") {
      const cars = await getCarsAggregatedByMonth(month);
      return tokeniser(cars);
    }
    const coe = await getCoeForMonth(month);
    return tokeniser(coe);
  });

  return regenerateBlogContent({
    data,
    month,
    dataType,
    workflowContext: context,
  });
};
