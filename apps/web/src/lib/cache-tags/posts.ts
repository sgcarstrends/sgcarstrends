export const getPostPublishRevalidationTags = (slug: string): string[] => {
  return ["posts:list", "posts:recent", `posts:slug:${slug}`];
};

export const getPostsWorkflowRevalidationTags = (): string[] => {
  return ["posts:list", "posts:recent"];
};
