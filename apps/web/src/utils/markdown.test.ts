import { parseMarkdownToHtml } from "@/utils/markdown";

describe("parseMarkdownToHtml", () => {
  it("should convert h2 headers", () => {
    const markdown = "## This is a heading";
    const html = parseMarkdownToHtml(markdown);

    expect(html).toContain(
      '<h2 class="text-2xl font-bold mb-4 mt-8">This is a heading</h2>',
    );
  });

  it("should convert h3 headers", () => {
    const markdown = "### This is a subheading";
    const html = parseMarkdownToHtml(markdown);

    expect(html).toContain(
      '<h3 class="text-xl font-semibold mb-3 mt-6">This is a subheading</h3>',
    );
  });

  it("should convert bullet lists with asterisks", () => {
    const markdown = "* First item\n* Second item";
    const html = parseMarkdownToHtml(markdown);

    expect(html).toContain('<ul class="list-disc ml-6 mb-4">');
    expect(html).toContain('<li class="mb-1">First item</li>');
    expect(html).toContain('<li class="mb-1">Second item</li>');
  });

  it("should convert bullet lists with dashes", () => {
    const markdown = "- First item\n- Second item";
    const html = parseMarkdownToHtml(markdown);

    expect(html).toContain('<ul class="list-disc ml-6 mb-4">');
    expect(html).toContain('<li class="mb-1">First item</li>');
    expect(html).toContain('<li class="mb-1">Second item</li>');
  });

  it("should convert bold text", () => {
    const markdown = "This is **bold** text";
    const html = parseMarkdownToHtml(markdown);

    expect(html).toContain("This is <strong>bold</strong> text");
  });

  it("should convert italic text", () => {
    const markdown = "This is *italic* text";
    const html = parseMarkdownToHtml(markdown);

    expect(html).toContain("This is <em>italic</em> text");
  });

  it("should convert paragraphs", () => {
    const markdown = "First paragraph\n\nSecond paragraph";
    const html = parseMarkdownToHtml(markdown);

    expect(html).toContain('<p class="mb-4">First paragraph</p>');
    expect(html).toContain('<p class="mb-4">Second paragraph</p>');
  });

  it("should convert line breaks", () => {
    const markdown = "Line one\nLine two";
    const html = parseMarkdownToHtml(markdown);

    expect(html).toContain("Line one<br>Line two");
  });

  it("should handle complex markdown with multiple elements", () => {
    const markdown = `## Main Heading

This is a paragraph with **bold** and *italic* text.

### Subheading

- First bullet point
- Second bullet point with **bold** text

Another paragraph here.`;

    const html = parseMarkdownToHtml(markdown);

    expect(html).toContain(
      '<h2 class="text-2xl font-bold mb-4 mt-8">Main Heading</h2>',
    );
    expect(html).toContain(
      '<h3 class="text-xl font-semibold mb-3 mt-6">Subheading</h3>',
    );
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<em>italic</em>");
    expect(html).toContain('<li class="mb-1">First bullet point</li>');
    expect(html).toContain(
      '<li class="mb-1">Second bullet point with <strong>bold</strong> text</li>',
    );
  });

  it("should handle empty string", () => {
    const html = parseMarkdownToHtml("");

    expect(html).toBe("");
  });

  it("should handle plain text without markdown", () => {
    const markdown = "Just plain text";
    const html = parseMarkdownToHtml(markdown);

    expect(html).toBe('<p class="mb-4">Just plain text</p>');
  });
});
