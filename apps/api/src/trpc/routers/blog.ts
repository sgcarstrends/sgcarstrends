import * as blogQueries from "@api/queries/blog";
import { publicProcedure, router } from "@api/trpc";
import { z } from "zod";

export const blogRouter = router({
  getAllPosts: publicProcedure.query(async () => {
    return blogQueries.getAllPosts();
  }),

  getPostBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return blogQueries.getPostBySlug(input.slug);
    }),

  getPostsByIds: publicProcedure
    .input(z.object({ postIds: z.array(z.string()) }))
    .query(async ({ input }) => {
      return blogQueries.getPostByIds(input.postIds);
    }),
});
