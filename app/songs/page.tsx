import { SongSearchList } from '@/components/song/song-search-list'
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
      <SongSearchList songs={songs} />
    </div>
  )
}
