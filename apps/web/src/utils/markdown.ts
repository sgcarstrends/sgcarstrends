export function parseMarkdownToHtml(markdown: string): string {
  return markdown
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mb-4 mt-8">$1</h2>')
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-xl font-semibold mb-3 mt-6">$1</h3>',
    )
    .replace(/^\* (.+)$/gm, '<li class="mb-1">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="mb-1">$1</li>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, "<br>")
    .replace(/^<li/gm, '<ul class="list-disc ml-6 mb-4"><li')
    .replace(/li>$/gm, "li></ul>")
    .replace(/<\/ul><ul[^>]*>/g, "")
    .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>')
    .replace(/<p class="mb-4"><h/g, "<h")
    .replace(/<\/h([123])><\/p>/g, "</h$1>")
    .replace(/<p class="mb-4"><ul/g, "<ul")
    .replace(/<\/ul><\/p>/g, "</ul>");
}
