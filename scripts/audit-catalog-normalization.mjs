import fs from 'node:fs/promises'
import path from 'node:path'
import {
  duplicateValues,
  fileExists,
  mdList,
  normalizeText,
  safeArray,
  toSlugList
} from './lib/audit-utils.mjs'

const root = process.cwd()
const songsPath = path.join(root, 'content', 'songs', 'index.json')
const albumsPath = path.join(root, 'content', 'albums', 'index.json')
const deepReadsDir = path.join(root, 'content', 'songs', 'deep-reads')
const rawLyricsDir = path.join(root, 'content', 'songs', 'raw-lyrics')
const reportJsonPath = path.join(root, 'docs', 'CATALOG-NORMALIZATION-AUDIT.json')
const reportMdPath = path.join(root, 'docs', 'CATALOG-NORMALIZATION-AUDIT.md')

async function main() {
  const [songsRaw, albumsRaw] = await Promise.all([
    fs.readFile(songsPath, 'utf8'),
    fs.readFile(albumsPath, 'utf8')
  ])

  const songs = safeArray(JSON.parse(songsRaw))
  const albums = safeArray(JSON.parse(albumsRaw))

  const albumSlugSet = new Set(toSlugList(albums))
  const songSlugList = toSlugList(songs)

  const missingAlbumSlug = []
  const albumSlugNotFound = []
  const missingDeepRead = []
  const missingRawLyrics = []
  const albumUsage = new Map()

  for (const song of songs) {
    if (!song || typeof song !== 'object') {
      continue
    }

    const slug = normalizeText(song.slug)
    const albumSlug = normalizeText(song.albumSlug)

    if (!albumSlug) {
      missingAlbumSlug.push(slug || '(unknown-song-slug)')
    } else {
      albumUsage.set(albumSlug, (albumUsage.get(albumSlug) || 0) + 1)
      if (!albumSlugSet.has(albumSlug)) {
        albumSlugNotFound.push({ slug: slug || '(unknown-song-slug)', albumSlug })
      }
    }

    if (!slug) {
      continue
    }

    const deepReadPath = path.join(deepReadsDir, `${slug}.md`)
    const rawLyricsPath = path.join(rawLyricsDir, `${slug}.txt`)

    if (!(await fileExists(deepReadPath))) {
      missingDeepRead.push(slug)
    }

    if (!(await fileExists(rawLyricsPath))) {
      missingRawLyrics.push(slug)
    }
  }

  const duplicateSongSlug = duplicateValues(songSlugList)
  const unusedAlbums = toSlugList(albums).filter((slug) => !albumUsage.has(slug))

  const report = {
    title: 'CATALOG NORMALIZATION AUDIT',
    generatedAt: new Date().toISOString(),
    totals: {
      songs: songs.length,
      albums: albums.length,
      uniqueSongSlugs: new Set(songSlugList).size
    },
    issues: {
      missingAlbumSlug,
      albumSlugNotFound,
      duplicateSongSlug,
      missingDeepRead,
      missingRawLyrics,
      unusedAlbums
    },
    summary: {
      missingAlbumSlugCount: missingAlbumSlug.length,
      albumSlugNotFoundCount: albumSlugNotFound.length,
      duplicateSongSlugCount: duplicateSongSlug.length,
      missingDeepReadCount: missingDeepRead.length,
      missingRawLyricsCount: missingRawLyrics.length,
      unusedAlbumsCount: unusedAlbums.length
    }
  }

  const reportMd = `# Catalog Normalization Audit\n\nGenerated: ${report.generatedAt}\n\n## Totals\n\n- Songs: ${report.totals.songs}\n- Albums: ${report.totals.albums}\n- Unique song slugs: ${report.totals.uniqueSongSlugs}\n\n## Summary\n\n- missingAlbumSlug: ${report.summary.missingAlbumSlugCount}\n- albumSlugNotFound: ${report.summary.albumSlugNotFoundCount}\n- duplicateSongSlug: ${report.summary.duplicateSongSlugCount}\n- missingDeepRead: ${report.summary.missingDeepReadCount}\n- missingRawLyrics: ${report.summary.missingRawLyricsCount}\n- unusedAlbums: ${report.summary.unusedAlbumsCount}\n\n## missingAlbumSlug\n\n${mdList(report.issues.missingAlbumSlug)}\n\n## albumSlugNotFound\n\n${mdList(report.issues.albumSlugNotFound.map((item) => `${item.slug} -> ${item.albumSlug}`))}\n\n## duplicateSongSlug\n\n${mdList(report.issues.duplicateSongSlug.map((item) => `${item.value} (x${item.count})`))}\n\n## missingDeepRead\n\n${mdList(report.issues.missingDeepRead)}\n\n## missingRawLyrics\n\n${mdList(report.issues.missingRawLyrics)}\n\n## unusedAlbums\n\n${mdList(report.issues.unusedAlbums)}\n`

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
