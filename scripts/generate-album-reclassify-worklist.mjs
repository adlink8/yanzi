import fs from 'node:fs/promises'
import path from 'node:path'
import {
  isArchiveLikeSlug,
  normalizeText,
  uniqueValues
} from './lib/audit-utils.mjs'

const root = process.cwd()
const songsPath = path.join(root, 'content', 'songs', 'index.json')
const albumsPath = path.join(root, 'content', 'albums', 'index.json')
const outJsonPath = path.join(root, 'docs', 'ALBUM-RECLASSIFY-WORKLIST.json')
const outMdPath = path.join(root, 'docs', 'ALBUM-RECLASSIFY-WORKLIST.md')

function suggestAlbum(song, normalAlbums) {
  const year = Number(song.releaseYear)
  const era = normalizeText(song.era)

  const yearCandidates = normalAlbums.filter((a) => Number(a.releaseYear) === year)
  if (yearCandidates.length === 1) {
    return {
      suggestedAlbumSlug: yearCandidates[0].slug,
      confidence: 'high',
      reason: 'single_album_for_release_year',
      candidateAlbumSlugs: [yearCandidates[0].slug]
    }
  }

  if (yearCandidates.length > 1) {
    const eraCandidates = yearCandidates.filter((a) => normalizeText(a.era) === era)
    if (eraCandidates.length === 1) {
      return {
        suggestedAlbumSlug: eraCandidates[0].slug,
        confidence: 'medium',
        reason: 'year_multi_match_era_single',
        candidateAlbumSlugs: eraCandidates.map((a) => a.slug)
      }
    }

    return {
      suggestedAlbumSlug: '',
      confidence: 'low',
      reason: 'year_has_multiple_album_candidates',
      candidateAlbumSlugs: yearCandidates.map((a) => a.slug)
    }
  }

  const eraCandidates = normalAlbums.filter((a) => normalizeText(a.era) === era)
  if (eraCandidates.length === 1) {
    return {
      suggestedAlbumSlug: eraCandidates[0].slug,
      confidence: 'low',
      reason: 'era_single_match_without_year',
      candidateAlbumSlugs: [eraCandidates[0].slug]
    }
  }

  return {
    suggestedAlbumSlug: '',
    confidence: 'low',
    reason: 'insufficient_signal_manual_decision_required',
    candidateAlbumSlugs: uniqueValues([...yearCandidates, ...eraCandidates].map((a) => a.slug))
  }
}

function mdRow(entry) {
  const candidates = entry.candidateAlbumSlugs.length > 0 ? entry.candidateAlbumSlugs.join(', ') : '-'
  const target = entry.suggestedAlbumSlug || '-'
  return `| ${entry.slug} | ${entry.currentAlbumSlug} | ${target} | ${entry.confidence} | ${candidates} | ${entry.reason} |`
}

async function main() {
  const [songsRaw, albumsRaw] = await Promise.all([
    fs.readFile(songsPath, 'utf8'),
    fs.readFile(albumsPath, 'utf8')
  ])

  const songs = JSON.parse(songsRaw)
  const albums = JSON.parse(albumsRaw)

  const normalAlbums = albums.filter((a) => !isArchiveLikeSlug(a.slug))
  const archiveSongs = songs.filter((s) => isArchiveLikeSlug(s.albumSlug))

  const entries = archiveSongs.map((song) => {
    const suggestion = suggestAlbum(song, normalAlbums)
    return {
      slug: song.slug,
      title: song.title,
      releaseYear: song.releaseYear,
      era: song.era,
      currentAlbumSlug: song.albumSlug,
      suggestedAlbumSlug: suggestion.suggestedAlbumSlug,
      confidence: suggestion.confidence,
      candidateAlbumSlugs: suggestion.candidateAlbumSlugs,
      reason: suggestion.reason
    }
  })

  const summary = {
    totalArchiveSongs: entries.length,
    suggestedHigh: entries.filter((e) => e.confidence === 'high' && e.suggestedAlbumSlug).length,
    suggestedMedium: entries.filter((e) => e.confidence === 'medium' && e.suggestedAlbumSlug).length,
    suggestedLowWithTarget: entries.filter((e) => e.confidence === 'low' && e.suggestedAlbumSlug).length,
    unresolved: entries.filter((e) => !e.suggestedAlbumSlug).length
  }

  const byCurrentAlbum = entries.reduce((acc, entry) => {
    acc[entry.currentAlbumSlug] = (acc[entry.currentAlbumSlug] || 0) + 1
    return acc
  }, {})

  const payload = {
    generatedAt: new Date().toISOString(),
    summary,
    byCurrentAlbum,
    entries
  }

  const md = `# Album Reclassify Worklist\n\nGenerated: ${payload.generatedAt}\n\n## Summary\n\n- total archive songs: ${summary.totalArchiveSongs}\n- high-confidence suggestions: ${summary.suggestedHigh}\n- medium-confidence suggestions: ${summary.suggestedMedium}\n- low-confidence suggestions with target: ${summary.suggestedLowWithTarget}\n- unresolved (manual): ${summary.unresolved}\n\n## Current Album Buckets\n\n${Object.entries(byCurrentAlbum).map(([slug, count]) => `- ${slug}: ${count}`).join('\n')}\n\n## Worklist\n\n| slug | current | suggested | confidence | candidates | reason |\n|------|---------|-----------|------------|------------|--------|\n${entries.map(mdRow).join('\n')}\n`

  await Promise.all([
    fs.writeFile(outJsonPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8'),
    fs.writeFile(outMdPath, md, 'utf8')
  ])

  console.log(JSON.stringify(summary, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
