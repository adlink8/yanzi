import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()

function asNumber(input, fallback) {
  const value = Number(input)
  return Number.isFinite(value) ? value : fallback
}

async function readJson(relPath) {
  const fullPath = path.join(root, relPath)
  const raw = await fs.readFile(fullPath, 'utf8')
  return JSON.parse(raw)
}

function check(name, actual, rule, expectedText) {
  const passed = rule(actual)
  return { name, actual, expectedText, passed }
}

async function main() {
  const maxArchive = asNumber(process.env.GATE_MAX_ARCHIVE, 85)
  const maxMvMissing = asNumber(process.env.GATE_MAX_MV_MISSING, 180)

  const [catalogAudit, contentAudit, albumWorklist] = await Promise.all([
    readJson('docs/CATALOG-NORMALIZATION-AUDIT.json'),
    readJson('docs/CONTENT-ISSUES-AUDIT.json'),
    readJson('docs/ALBUM-RECLASSIFY-WORKLIST.json')
  ])

  const catalogSummary = catalogAudit.summary || {}
  const contentSummary = contentAudit.summary || {}
  const worklistSummary = albumWorklist.summary || {}

  const checks = [
    check('missingAlbumSlug', catalogSummary.missingAlbumSlugCount ?? -1, (n) => n === 0, '== 0'),
    check('albumSlugNotFound', catalogSummary.albumSlugNotFoundCount ?? -1, (n) => n === 0, '== 0'),
    check('missingDeepRead', catalogSummary.missingDeepReadCount ?? -1, (n) => n === 0, '== 0'),
    check('missingRawLyrics', catalogSummary.missingRawLyricsCount ?? -1, (n) => n === 0, '== 0'),
    check('archiveAlbumAssignments', contentSummary.archiveAlbumAssignments ?? -1, (n) => n <= maxArchive, `<= ${maxArchive}`),
    check('mvMissing', contentSummary.mvMissing ?? -1, (n) => n <= maxMvMissing, `<= ${maxMvMissing}`),
    check('albumWorklistTotal', worklistSummary.totalArchiveSongs ?? -1, (n) => n >= 0, '>= 0')
  ]

  const failed = checks.filter((c) => !c.passed)
  const passed = failed.length === 0

  console.log('CONTENT GATE')
  console.log(`result: ${passed ? 'PASS' : 'FAIL'}`)
  console.log(`thresholds: GATE_MAX_ARCHIVE=${maxArchive}, GATE_MAX_MV_MISSING=${maxMvMissing}`)
  console.log('metrics:')

  for (const c of checks) {
    console.log(`- ${c.name}: actual=${c.actual}, expected=${c.expectedText}, status=${c.passed ? 'PASS' : 'FAIL'}`)
  }

  if (!passed) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
