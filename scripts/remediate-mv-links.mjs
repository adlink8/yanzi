import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { normalizeHttpUrl } from './lib/audit-utils.mjs'
import { MV_REMEDIATION_RULES } from './config/audit-rules.mjs'

const root = process.cwd()
const deepReadsDir = path.join(root, 'content', 'songs', 'deep-reads')
const reportPath = path.join(root, 'docs', 'MV-LINK-REMEDIATION.md')

function isHomepageLikeMvUrl(raw) {
  const parsed = normalizeHttpUrl(raw)
  if (!parsed) {
    return false
  }

  const host = parsed.host.toLowerCase()
  const isKnownHomepageHost = MV_REMEDIATION_RULES.homepageHosts.includes(host)
  const isRootPath = MV_REMEDIATION_RULES.rootPathnames.includes(parsed.pathname)
  const noLocator = !parsed.search && !parsed.hash

  return isKnownHomepageHost && isRootPath && noLocator
}

async function main() {
  const names = (await fs.readdir(deepReadsDir)).filter((name) => name.endsWith('.md') && name !== '_template.md')

  const changed = []
  let scanned = 0

  for (const name of names) {
    const fullPath = path.join(deepReadsDir, name)
    const raw = await fs.readFile(fullPath, 'utf8')
    const parsed = matter(raw)

    scanned += 1

    const mvUrl = typeof parsed.data.mvUrl === 'string' ? parsed.data.mvUrl.trim() : ''
    if (!isHomepageLikeMvUrl(mvUrl)) {
      continue
    }

    const slug = name.replace(/\.md$/, '')

    delete parsed.data.mvUrl
    delete parsed.data.mvTitle

    const next = matter.stringify(parsed.content, parsed.data)
    await fs.writeFile(fullPath, next, 'utf8')

    changed.push(slug)
  }

  const report = `# MV Link Remediation\n\nGenerated: ${new Date().toISOString()}\n\n## Summary\n\n- scanned files: ${scanned}\n- remediated files: ${changed.length}\n\n## Remediated Slugs\n\n${changed.length === 0 ? '- none' : changed.map((slug) => `- ${slug}`).join('\n')}\n\n## Rule\n\n- Removed homepage-like MV links (https://www.bilibili.com/) that cannot direct to a specific MV.\n- Cleared paired mvTitle when mvUrl is removed to keep frontmatter consistent.\n`

  await fs.writeFile(reportPath, report, 'utf8')

  console.log(JSON.stringify({ scanned, remediated: changed.length }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
