import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { STYLE_AUDIT_RULES } from './config/audit-rules.mjs'

const root = process.cwd()
const deepReadsDir = path.join(root, 'content', 'songs', 'deep-reads')
const outPath = path.join(root, 'docs', 'DEEPREAD-STYLE-AUDIT.md')

function tokenize(text) {
  return text
    .replace(/[\n\r]/g, ' ')
    .split(/\s+/)
    .map((v) => v.trim())
    .filter(Boolean)
}

function scoreBody(body) {
  const tokens = tokenize(body)
  const unique = new Set(tokens)
  const uniqRatio = tokens.length > 0 ? unique.size / tokens.length : 0

  const phraseHits = STYLE_AUDIT_RULES.genericPhrases.reduce((count, phrase) => count + (body.includes(phrase) ? 1 : 0), 0)
  const paragraphCount = body.split(/\n\s*\n/g).map((v) => v.trim()).filter(Boolean).length

  let score = 0
  const reasons = []

  if (phraseHits >= 2) {
    score += phraseHits
    reasons.push(`generic_phrase_hits=${phraseHits}`)
  }

  if (tokens.length < STYLE_AUDIT_RULES.minTokens) {
    score += 2
    reasons.push(`short_token_count=${tokens.length}`)
  }

  if (uniqRatio < STYLE_AUDIT_RULES.minUniqueRatio) {
    score += 2
    reasons.push(`low_unique_ratio=${uniqRatio.toFixed(2)}`)
  }

  if (paragraphCount < STYLE_AUDIT_RULES.minParagraphs) {
    score += 1
    reasons.push(`low_paragraph_count=${paragraphCount}`)
  }

  return { score, reasons, tokens: tokens.length, uniqRatio, paragraphCount }
}

async function main() {
  const names = (await fs.readdir(deepReadsDir)).filter((n) => n.endsWith('.md') && n !== '_template.md')

  const candidates = []

  for (const name of names) {
    const full = path.join(deepReadsDir, name)
    const raw = await fs.readFile(full, 'utf8')
    const parsed = matter(raw)
    const body = (parsed.content || '').trim()

    const measured = scoreBody(body)
    if (measured.score >= STYLE_AUDIT_RULES.candidateMinScore) {
      candidates.push({
        slug: name.replace(/\.md$/, ''),
        score: measured.score,
        reasons: measured.reasons,
        tokens: measured.tokens,
        uniqRatio: measured.uniqRatio,
        paragraphCount: measured.paragraphCount
      })
    }
  }

  candidates.sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))

  const md = `# DeepRead Style Audit\n\nGenerated: ${new Date().toISOString()}\n\n## Rule\n\n- Candidate is flagged when style score >= ${STYLE_AUDIT_RULES.candidateMinScore}.\n- Score factors: generic phrase repetition, low token count, low unique-token ratio, low paragraph count.\n\n## Summary\n\n- total deep-reads scanned: ${names.length}\n- candidates flagged: ${candidates.length}\n\n## Candidates\n\n| slug | score | tokens | unique_ratio | paragraphs | reasons |\n|------|-------|--------|--------------|------------|---------|\n${candidates.length === 0 ? '| none | 0 | 0 | 0 | 0 | - |' : candidates.map((c) => `| ${c.slug} | ${c.score} | ${c.tokens} | ${c.uniqRatio.toFixed(2)} | ${c.paragraphCount} | ${c.reasons.join('; ')} |`).join('\n')}\n`

  await fs.writeFile(outPath, md, 'utf8')
  console.log(JSON.stringify({ scanned: names.length, flagged: candidates.length }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
