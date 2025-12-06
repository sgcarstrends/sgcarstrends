import {
  generateAndSavePost,
  getCarsAggregatedByMonth,
  getCoeForMonth,
} from "@sgcarstrends/ai";
import { tokeniser } from "@sgcarstrends/utils";
import type { WorkflowContext } from "@upstash/workflow";

export const generateCarPost = async (
  context: WorkflowContext,
  month: string,
) => {
  return context.run("Generate blog post for cars", async () => {
    const cars = await getCarsAggregatedByMonth(month);
    const data = tokeniser(cars);
    return generateAndSavePost({ data, month, dataType: "cars" });
  });
};

export const generateCoePost = async (
  context: WorkflowContext,
  month: string,
) => {
  return context.run("Generate blog post for coe", async () => {
    const coe = await getCoeForMonth(month);
    const data = tokeniser(coe);
    return generateAndSavePost({ data, month, dataType: "coe" });
  });
};
