import type { Route } from 'next'
import Link from 'next/link'
import { isPlaceholderLikeText } from '@/lib/content/sanitize'
import { getAlbums, getTimeline } from '@/lib/content'

export default async function TimelinePage() {
  const [timeline, albums] = await Promise.all([getTimeline(), getAlbums()])
  const albumsMap = new Map(albums.map((album) => [album.slug, album]))
  const sortedTimeline = timeline.slice().sort((left, right) => left.date.localeCompare(right.date))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold">时间线</h2>
        <p className="mt-2 text-sm text-muted">先按时间线进入时期，再转到专辑，最后逐首歌补全。</p>
      </div>
      <div className="space-y-4">
        {sortedTimeline.map((item) => {
          const relatedAlbum = item.relatedAlbumSlug ? albumsMap.get(item.relatedAlbumSlug) : undefined
          const era = relatedAlbum?.era ?? (item.type === 'album' ? '官方单曲合集' : '单曲/活动单曲')
          const albumHref = relatedAlbum ? (`/albums/${relatedAlbum.slug}` as Route) : null
          const displayTitle = isPlaceholderLikeText(item.title)
            ? (relatedAlbum ? `《${relatedAlbum.title}》时期` : `${item.date} 事件`)
            : item.title
          const displayDescription = isPlaceholderLikeText(item.description)
            ? '该时期说明正在整理中。'
            : item.description

          return (
            <section key={item.id} className="card space-y-2" data-era={era}>
              <p className="text-sm text-muted">{item.date} · {item.type}</p>
              <h3 className="font-serif text-lg font-medium">{displayTitle}</h3>
              <p className="text-sm text-muted">{displayDescription}</p>
              {relatedAlbum && albumHref ? (
                <Link href={albumHref} className="inline-flex rounded-full border border-line px-4 py-2 text-sm no-underline hover:bg-paper">
                  进入专辑：{relatedAlbum.title}
                </Link>
              ) : null}
            </section>
          )
        })}
      </div>
    </div>
  )
}
