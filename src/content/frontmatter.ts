/**
 * Minimal front-matter reader. Case-study front matter is flat `key: value` pairs,
 * so a full YAML parser would be a dependency for nothing.
 */
export function parseFrontmatter(raw: string): {
  data: Record<string, string | boolean>
  body: string
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!match) return { data: {}, body: raw }

  const data: Record<string, string | boolean> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const pair = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line)
    if (!pair) continue
    const value = pair[2].trim().replace(/^["'](.*)["']$/, '$1')
    data[pair[1]] = value === 'true' ? true : value === 'false' ? false : value
  }
  return { data, body: raw.slice(match[0].length) }
}
