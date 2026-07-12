import { marked } from 'marked'

/**
 * Renders article content (markdown or HTML) to SEO-friendly HTML.
 * - Converts markdown to real HTML tags (h2/h3, lists, bold, links) so Google can read structure
 * - Strips a leading H1 that duplicates the page title (PageHero already renders the H1)
 * - Demotes any remaining H1s to H2 (exactly one H1 per page)
 * - Existing HTML content passes through with only H1 demotion
 */
export function renderArticleHtml(raw: string): string {
  if (!raw) return ''
  let content = raw.trim()

  const isHtml = /<h[1-6][ >]|<p[ >]/.test(content)

  if (isHtml) {
    return content
      .replace(/<h1([^>]*)>/gi, '<h2$1>')
      .replace(/<\/h1>/gi, '</h2>')
  }

  // Markdown: drop leading H1 line (duplicate of page title), demote other H1s to H2
  content = content.replace(/^\s*# [^\n]+\n+/, '')
  content = content.replace(/^# (.+)$/gm, '## $1')

  return marked.parse(content, { async: false }) as string
}
