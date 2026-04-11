import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import {
  duplicateValues,
  isArchiveLikeSlug,
  mdList,
  normalizeHttpUrl,
  normalizeText,
  summarizeIssueCounts,
  toSlugList
} from './lib/audit-utils.mjs'
import { CONTENT_AUDIT_RULES } from './config/audit-rules.mjs'

const root = process.cwd()
const songsPath = path.join(root, 'content', 'songs', 'index.json')
const albumsPath = path.join(root, 'content', 'albums', 'index.json')
const deepReadsDir = path.join(root, 'content', 'songs', 'deep-reads')
const reportJsonPath = path.join(root, 'docs', 'CONTENT-ISSUES-AUDIT.json')
const reportMdPath = path.join(root, 'docs', 'CONTENT-ISSUES-AUDIT.md')

async function main() {
  const [songsRaw, albumsRaw] = await Promise.all([
    fs.readFile(songsPath, 'utf8'),
    fs.readFile(albumsPath, 'utf8')
  ])

  const songs = JSON.parse(songsRaw)
  const albums = JSON.parse(albumsRaw)
  const albumSlugSet = new Set(toSlugList(albums))
  const trustedVideoHosts = new Set(CONTENT_AUDIT_RULES.trustedVideoHosts)

  const issues = {
    missingAlbumSlug: [],
    albumSlugNotFound: [],
    archiveAlbumAssignments: [],
    missingDeepRead: [],
    deepReadTooShort: [],
    deepReadLikelyAIGeneric: [],
    weakLyricInterpretations: [],
    weakSongDesign: [],
    mvMissing: [],
    mvMalformed: [],
    mvTitleUrlMismatch: [],
    mvSuspiciousPattern: [],
    mvNonTrustedHost: [],
    mvDuplicateAcrossSongs: []
  }

  const allMvUrls = []

  for (const song of songs) {
    const slug = normalizeText(song.slug)
    const albumSlug = normalizeText(song.albumSlug)

    if (!slug) {
      continue
    }

    if (!albumSlug) {
      issues.missingAlbumSlug.push(slug)
    } else {
      if (!albumSlugSet.has(albumSlug)) {
        issues.albumSlugNotFound.push(`${slug} -> ${albumSlug}`)
      }
      if (isArchiveLikeSlug(albumSlug)) {
        issues.archiveAlbumAssignments.push(`${slug} -> ${albumSlug}`)
      }
    }

    const deepReadPath = path.join(deepReadsDir, `${slug}.md`)
    let deepReadRaw = ''

    try {
      deepReadRaw = await fs.readFile(deepReadPath, 'utf8')
    } catch {
      issues.missingDeepRead.push(slug)
      continue
    }

    const parsed = matter(deepReadRaw)
    const body = normalizeText(parsed.content)

    if (body.length < CONTENT_AUDIT_RULES.deepReadMinChars) {
      issues.deepReadTooShort.push(slug)
    }

    const genericHitCount = CONTENT_AUDIT_RULES.genericPhrases.reduce((count, phrase) => {
      return count + (body.includes(phrase) ? 1 : 0)
    }, 0)

    if (genericHitCount >= 2) {
      issues.deepReadLikelyAIGeneric.push(`${slug} (hits=${genericHitCount})`)
    }

    const lyricInterpretations = Array.isArray(parsed.data.lyricInterpretations) ? parsed.data.lyricInterpretations : []
    if (lyricInterpretations.length < CONTENT_AUDIT_RULES.lyricInterpretationsMin) {
      issues.weakLyricInterpretations.push(`${slug} (count=${lyricInterpretations.length})`)
    }

    const songDesign = parsed.data.songDesign && typeof parsed.data.songDesign === 'object' ? parsed.data.songDesign : {}
    const designSummary = normalizeText(songDesign.summary)
    if (designSummary.length < CONTENT_AUDIT_RULES.songDesignSummaryMinChars) {
      issues.weakSongDesign.push(`${slug} (summaryLen=${designSummary.length})`)
    }

    const mvUrl = normalizeText(parsed.data.mvUrl)
    const mvTitle = normalizeText(parsed.data.mvTitle)

    if (!mvUrl) {
      issues.mvMissing.push(slug)
    } else {
      const normalized = normalizeHttpUrl(mvUrl)
      if (!normalized) {
        issues.mvMalformed.push(`${slug} -> ${mvUrl}`)
      } else {
        allMvUrls.push(normalized.toString())

        const host = normalized.host.toLowerCase()
        const urlLower = normalized.toString().toLowerCase()

        if (!trustedVideoHosts.has(host)) {
          issues.mvNonTrustedHost.push(`${slug} -> ${host}`)
        }

        const isSuspicious = CONTENT_AUDIT_RULES.suspiciousMvKeywords.some((keyword) => urlLower.includes(keyword))
        if (isSuspicious) {
          issues.mvSuspiciousPattern.push(`${slug} -> ${normalized.toString()}`)
        }
      }
    }

    if ((mvTitle && !mvUrl) || (!mvTitle && mvUrl)) {
      issues.mvTitleUrlMismatch.push(`${slug} (title=${mvTitle ? 'yes' : 'no'}, url=${mvUrl ? 'yes' : 'no'})`)
    }
  }

  const mvDup = duplicateValues(allMvUrls)
  issues.mvDuplicateAcrossSongs = mvDup.map((item) => `${item.value} (x${item.count})`)

  const report = {
    title: 'CONTENT ISSUES AUDIT',
    generatedAt: new Date().toISOString(),
    totals: {
      songs: songs.length,
      albums: albums.length
    },
    summary: summarizeIssueCounts(issues),
    issues
  }

  const reportMd = `# Content Issues Audit\n\nGenerated: ${report.generatedAt}\n\n## Totals\n\n- Songs: ${report.totals.songs}\n- Albums: ${report.totals.albums}\n\n## Summary\n\n- missingAlbumSlug: ${report.summary.missingAlbumSlug}\n- albumSlugNotFound: ${report.summary.albumSlugNotFound}\n- archiveAlbumAssignments: ${report.summary.archiveAlbumAssignments}\n- missingDeepRead: ${report.summary.missingDeepRead}\n- deepReadTooShort: ${report.summary.deepReadTooShort}\n- deepReadLikelyAIGeneric: ${report.summary.deepReadLikelyAIGeneric}\n- weakLyricInterpretations: ${report.summary.weakLyricInterpretations}\n- weakSongDesign: ${report.summary.weakSongDesign}\n- mvMissing: ${report.summary.mvMissing}\n- mvMalformed: ${report.summary.mvMalformed}\n- mvTitleUrlMismatch: ${report.summary.mvTitleUrlMismatch}\n- mvSuspiciousPattern: ${report.summary.mvSuspiciousPattern}\n- mvNonTrustedHost: ${report.summary.mvNonTrustedHost}\n- mvDuplicateAcrossSongs: ${report.summary.mvDuplicateAcrossSongs}\n\n## missingAlbumSlug\n\n${mdList(report.issues.missingAlbumSlug)}\n\n## albumSlugNotFound\n\n${mdList(report.issues.albumSlugNotFound)}\n\n## archiveAlbumAssignments\n\n${mdList(report.issues.archiveAlbumAssignments)}\n\n## missingDeepRead\n\n${mdList(report.issues.missingDeepRead)}\n\n## deepReadTooShort\n\n${mdList(report.issues.deepReadTooShort)}\n\n## deepReadLikelyAIGeneric\n\n${mdList(report.issues.deepReadLikelyAIGeneric)}\n\n## weakLyricInterpretations\n\n${mdList(report.issues.weakLyricInterpretations)}\n\n## weakSongDesign\n\n${mdList(report.issues.weakSongDesign)}\n\n## mvMissing\n\n${mdList(report.issues.mvMissing)}\n\n## mvMalformed\n\n${mdList(report.issues.mvMalformed)}\n\n## mvTitleUrlMismatch\n\n${mdList(report.issues.mvTitleUrlMismatch)}\n\n## mvSuspiciousPattern\n\n${mdList(report.issues.mvSuspiciousPattern)}\n\n## mvNonTrustedHost\n\n${mdList(report.issues.mvNonTrustedHost)}\n\n## mvDuplicateAcrossSongs\n\n${mdList(report.issues.mvDuplicateAcrossSongs)}\n`

  await Promise.all([
    fs.writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8'),
    fs.writeFile(reportMdPath, reportMd, 'utf8')
  ])

  console.log(JSON.stringify(report.summary, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
