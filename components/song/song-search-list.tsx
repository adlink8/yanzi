'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Song } from '@/types/content'

type SongSearchListProps = {
  songs: Song[]
}

function buildSongSearchText(song: Song): string {
  return [
    song.title,
    song.summary,
    ...song.moodTags,
    ...song.themeTags,
    ...song.keywords
  ]
    .join(' ')
    .toLowerCase()
}

export function SongSearchList({ songs }: SongSearchListProps) {
  const [query, setQuery] = useState('')
  const normalized = query.trim().toLowerCase()

  const filteredSongs = useMemo(() => {
    if (!normalized) {
      return songs
    }

    const terms = normalized.split(/\s+/).filter(Boolean)
    return songs.filter((song) => {
      const searchable = buildSongSearchText(song)
      return terms.every((term) => searchable.includes(term))
    })
  }, [normalized, songs])

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <label htmlFor="song-search" className="text-sm font-medium">
          全局搜索
        </label>
        <input
          id="song-search"
          className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-accent"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索歌名、摘要、情绪、主题、关键词"
        />
        <p className="text-xs text-muted">
          {normalized ? `命中 ${filteredSongs.length} / ${songs.length} 首` : `共 ${songs.length} 首`}
        </p>
      </div>

      {filteredSongs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredSongs.map((song) => {
            const songHref = `/songs/${song.slug}` as Route
            return (
              <Link key={song.slug} href={songHref} className="card no-underline hover:bg-paper" data-era={song.era}>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">
                  {song.releaseYear ?? '未知年份'} · {song.era}
                </p>
                <p className="mt-2 font-serif text-lg font-medium">{song.title}</p>
                <p className="mt-2 text-sm text-muted">{song.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[...song.moodTags, ...song.themeTags].slice(0, 4).map((tag, index) => (
                    <span key={`${song.slug}-${tag}-${index}`} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="card text-sm text-muted">没有匹配结果，换个关键词试试。</div>
      )}
    </div>
  )
}
