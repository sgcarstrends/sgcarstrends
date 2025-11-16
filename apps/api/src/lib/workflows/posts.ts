import {
  generatePost,
  getCarsAggregatedByMonth,
  getCoeForMonth,
} from "@sgcarstrends/ai";
import { tokeniser } from "@sgcarstrends/utils";
import type { WorkflowContext } from "@upstash/workflow";

export const generateCarPost = async (
  context: WorkflowContext,
  month: string,
) => {
  // Get car data from database
  const cars = await getCarsAggregatedByMonth(month);
  const data = tokeniser(cars);

  return generatePost(context, {
    data,
    month,
    dataType: "cars",
  });
};

export const generateCoePost = async (
  context: WorkflowContext,
  month: string,
) => {
  // Get COE data from database for both bidding exercises
  const coe = await getCoeForMonth(month);
  const data = tokeniser(coe);

  return generatePost(context, {
    data,
    month,
    dataType: "coe",
  });
};
