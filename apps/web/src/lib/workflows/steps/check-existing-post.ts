import type { WorkflowContext } from "@upstash/workflow";
import { getExistingPostByMonth } from "@web/queries/posts";

/**
 * Check if a blog post already exists for the given month and data type.
 * Returns the existing post or null.
 */
export const checkExistingPost = async (
  context: WorkflowContext,
  month: string,
  dataType: "cars" | "coe",
) => {
  return context.run(`check-existing-${dataType}-post`, async () => {
    const [existingPost] = await getExistingPostByMonth(month, dataType);
    return existingPost ?? null;
  });
};
