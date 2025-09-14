import { generatePost } from "@api/lib/gemini/generate-post";
import { getCarsAggregatedByMonth } from "@api/queries";
import { getCoeForMonth } from "@api/queries/coe";
import type { WorkflowContext } from "@upstash/workflow";

export const generateCarPost = async (
  context: WorkflowContext,
  month: string,
) => {
  // Get car data from database
  const cars = await getCarsAggregatedByMonth(month);
  const data = cars.map((row) => JSON.stringify(row));

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
  const data = coe.map((row) => JSON.stringify(row));

  return generatePost(context, {
    data,
    month,
    dataType: "coe",
  });
};
