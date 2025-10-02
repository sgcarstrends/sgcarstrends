import type { SelectPost } from "@sgcarstrends/database";
import { render, screen } from "@testing-library/react";
import { RecentPosts } from "./recent-posts";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("RecentPosts", () => {
  const mockPosts: SelectPost[] = [
    {
      id: 1,
      title: "First Post",
      slug: "first-post",
      content: "Content of first post",
      excerpt: "Excerpt",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      publishedAt: new Date("2024-01-15"),
      month: "2024-01",
      aiGenerated: false,
      aiModel: null,
      tags: [],
      readingTime: 5,
      seoTitle: null,
      seoDescription: null,
    },
    {
      id: 2,
      title: "Second Post",
      slug: "second-post",
      content: "Content of second post",
      excerpt: "Excerpt",
      createdAt: new Date("2024-02-20"),
      updatedAt: new Date("2024-02-20"),
      publishedAt: null,
      month: "2024-02",
      aiGenerated: true,
      aiModel: "gemini",
      tags: [],
      readingTime: 3,
      seoTitle: null,
      seoDescription: null,
    },
  ];

  it("should render title and view all link", () => {
    render(<RecentPosts posts={mockPosts} />);

    expect(screen.getByText("Recent Posts")).toBeInTheDocument();
    expect(screen.getByText("View all")).toBeInTheDocument();
  });

  it("should render all posts", () => {
    render(<RecentPosts posts={mockPosts} />);

    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
  });

  it("should render published date when available", () => {
    render(<RecentPosts posts={mockPosts} />);

    expect(screen.getByText("15 Jan")).toBeInTheDocument();
  });

  it("should use createdAt when publishedAt is null", () => {
    render(<RecentPosts posts={mockPosts} />);

    expect(screen.getByText("20 Feb")).toBeInTheDocument();
  });

  it("should render with empty posts", () => {
    render(<RecentPosts posts={[]} />);

    expect(screen.getByText("Recent Posts")).toBeInTheDocument();
  });

  it("should have links to blog posts", () => {
    render(<RecentPosts posts={mockPosts} />);

    const firstPostLink = screen.getByText("First Post").closest("a");
    expect(firstPostLink).toHaveAttribute("href", "/blog/first-post");

    const secondPostLink = screen.getByText("Second Post").closest("a");
    expect(secondPostLink).toHaveAttribute("href", "/blog/second-post");
  });

  it("should have link to blog page", () => {
    render(<RecentPosts posts={mockPosts} />);

    const link = screen.getByText("View all").closest("a");
    expect(link).toHaveAttribute("href", "/blog");
  });
});
