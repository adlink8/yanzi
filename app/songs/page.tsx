import type { Route } from 'next'
import Link from 'next/link'
import { getSongs } from '@/lib/content'

export default async function SongsPage() {
  const songs = (await getSongs())
    .slice()
    .sort((left, right) => {
      const yearDiff = (left.releaseYear ?? 9999) - (right.releaseYear ?? 9999)
      if (yearDiff !== 0) return yearDiff
      const trackDiff = (left.trackNumber ?? 999) - (right.trackNumber ?? 999)
      if (trackDiff !== 0) return trackDiff
      return left.title.localeCompare(right.title, 'zh-CN')
    })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">歌曲</h2>
        <p className="mt-2 text-sm text-muted">按时间线与专辑顺序浏览，再进入逐首深读。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {songs.map((song) => {
          const songHref = `/songs/${song.slug}` as Route
          return (
            <Link key={song.slug} href={songHref} className="card no-underline hover:bg-paper">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">{song.releaseYear ?? '未知年份'} · {song.era}</p>
              <p className="mt-2 text-lg font-medium">{song.title}</p>
              <p className="mt-2 text-sm text-muted">{song.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[...song.moodTags, ...song.themeTags].slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-muted">{tag}</span>
                ))}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}