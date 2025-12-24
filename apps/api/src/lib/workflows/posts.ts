import {
  generateBlogContent,
  getCarsAggregatedByMonth,
  getCoeForMonth,
} from "@sgcarstrends/ai";
import { tokeniser } from "@sgcarstrends/utils";
import type { WorkflowContext } from "@upstash/workflow";

export const generateCarPost = async (
  context: WorkflowContext,
  month: string,
) => {
  const cars = await context.run("Fetch cars data", async () => {
    return getCarsAggregatedByMonth(month);
  });

  const data = tokeniser(cars);

  return generateBlogContent({
    data,
    month,
    dataType: "cars",
    workflowContext: context,
  });
};

export const generateCoePost = async (
  context: WorkflowContext,
  month: string,
) => {
  const coe = await context.run("Fetch COE data", async () => {
    return getCoeForMonth(month);
  });

  const data = tokeniser(coe);

  return generateBlogContent({
    data,
    month,
    dataType: "coe",
    workflowContext: context,
  });
};
