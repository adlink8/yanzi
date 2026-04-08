import type { Route } from 'next'
import Link from 'next/link'
import { getAlbums } from '@/lib/content'

export default async function AlbumsPage() {
  const albums = (await getAlbums()).slice().sort((left, right) => left.releaseYear - right.releaseYear)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">专辑</h2>
        <p className="mt-2 text-sm text-muted">按时间线顺序进入各个时期，再进入对应专辑。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {albums.map((album) => {
          const albumHref = `/albums/${album.slug}` as Route
          return (
            <Link key={album.slug} href={albumHref} className="card space-y-3 no-underline hover:bg-paper">
              <div>
                <p className="text-sm text-muted">{album.releaseYear} · {album.era}</p>
                <h3 className="text-xl font-semibold">{album.title}</h3>
              </div>
              <p className="text-sm text-muted">{album.summary}</p>
              <p className="text-sm text-muted">代表歌：{album.representativeSongs.join('、')}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}