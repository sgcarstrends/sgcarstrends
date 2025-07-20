import {
  getAllBlogPosts,
  getFeaturedBlogPosts,
  getBlogPostBySlug,
  getBlogPostMetadata,
  calculateReadingTime,
} from "@/utils/blog";

describe("blog utilities", () => {
  describe("getAllBlogPosts", () => {
    it("should return all blog posts sorted by published date (newest first)", () => {
      const posts = getAllBlogPosts();

      expect(posts).toHaveLength(2);
      expect(posts[0].publishedDate).toBe("2024-12-15");
      expect(posts[1].publishedDate).toBe("2024-11-28");
    });

    it("should return posts with all required fields", () => {
      const posts = getAllBlogPosts();

      posts.forEach((post) => {
        expect(post).toHaveProperty("slug");
        expect(post).toHaveProperty("title");
        expect(post).toHaveProperty("excerpt");
        expect(post).toHaveProperty("content");
        expect(post).toHaveProperty("publishedDate");
        expect(post).toHaveProperty("author");
        expect(post).toHaveProperty("tags");
        expect(post).toHaveProperty("readingTime");
      });
    });
  });

  describe("getFeaturedBlogPosts", () => {
    it("should return only featured blog posts", () => {
      const featuredPosts = getFeaturedBlogPosts();

      expect(featuredPosts).toHaveLength(1);
      expect(featuredPosts[0].featured).toBe(true);
      expect(featuredPosts[0].slug).toBe("singapore-car-market-trends-2024");
    });
  });

  describe("getBlogPostBySlug", () => {
    it("should return the correct blog post when slug exists", () => {
      const post = getBlogPostBySlug("singapore-car-market-trends-2024");

      expect(post).toBeDefined();
      expect(post?.title).toBe(
        "Singapore Car Market Trends in 2024: What the Data Reveals",
      );
    });

    it("should return undefined when slug does not exist", () => {
      const post = getBlogPostBySlug("non-existent-slug");

      expect(post).toBeUndefined();
    });
  });

  describe("getBlogPostMetadata", () => {
    it("should return metadata without content and readingTime", () => {
      const metadata = getBlogPostMetadata();

      expect(metadata).toHaveLength(2);
      metadata.forEach((meta) => {
        expect(meta).not.toHaveProperty("content");
        expect(meta).not.toHaveProperty("readingTime");
        expect(meta).toHaveProperty("title");
        expect(meta).toHaveProperty("excerpt");
        expect(meta).toHaveProperty("publishedDate");
        expect(meta).toHaveProperty("author");
        expect(meta).toHaveProperty("tags");
      });
    });
  });

  describe("calculateReadingTime", () => {
    it("should calculate reading time correctly for short content", () => {
      const content =
        "This is a short piece of content with exactly ten words here.";
      const readingTime = calculateReadingTime(content);

      expect(readingTime).toBe(1); // 10 words / 200 wpm = 0.05 minutes, rounded up to 1
    });

    it("should calculate reading time correctly for longer content", () => {
      const content = "word ".repeat(400); // 400 words
      const readingTime = calculateReadingTime(content);

      expect(readingTime).toBe(2); // 400 words / 200 wpm = 2 minutes
    });

    it("should handle empty content", () => {
      const readingTime = calculateReadingTime("");

      expect(readingTime).toBe(1); // Math.ceil(0 / 200) = 1
    });

    it("should handle content with multiple spaces", () => {
      const content = "word   with    multiple    spaces";
      const readingTime = calculateReadingTime(content);

      expect(readingTime).toBe(1); // 4 words after trimming and splitting
    });
  });
});
