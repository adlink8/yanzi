import type { Route } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AlbumAiPanel } from '@/components/album/album-ai-panel'
import { getAlbum, getAlbums, getSongsByAlbum } from '@/lib/content'

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  const albums = await getAlbums()
  return albums.map((album) => ({ slug: album.slug }))
}

export default async function AlbumDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const album = await getAlbum(slug)

  if (!album) {
    notFound()
  }

  const songs = await getSongsByAlbum(album.slug)
  const readyCount = songs.filter((song) => song.status === 'ready').length
  const deepReadCount = songs.filter((song) => song.hasDeepRead).length

  return (
    <div className="space-y-6" data-era={album.era}>
      <section className="card space-y-4">
        <div>
          <p className="text-sm text-muted">{album.releaseYear} · {album.era}</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold">{album.title}</h2>
        </div>
        <p className="text-base text-muted">{album.summary}</p>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-2xl font-semibold">{songs.length}</p>
            <p className="text-sm text-muted">首关联歌曲</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{readyCount}</p>
            <p className="text-sm text-muted">首已就绪卡片</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{deepReadCount}</p>
            <p className="text-sm text-muted">篇深度解读</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <article className="card space-y-4">
          <h3 className="font-serif text-xl font-semibold">专辑气质</h3>
          <p className="text-sm leading-7 text-muted">
            这张专辑适合从“{album.coreThemes.join(' / ')}”的角度理解。你后续可以在这里继续补充更完整的时期判断、
            个人偏爱曲目、反复回听时最容易被触发的情绪，以及它和其他专辑之间的关系。
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {album.coreThemes.map((theme) => (
              <span key={theme} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                {theme}
              </span>
            ))}
          </div>
        </article>

        <aside className="card space-y-4">
          <h3 className="font-serif text-xl font-semibold">代表歌</h3>
          <div className="space-y-3">
            {album.representativeSongs.map((title) => (
              <p key={title} className="text-sm text-muted">{title}</p>
            ))}
          </div>
        </aside>
      </section>

      <AlbumAiPanel slug={album.slug} title={album.title} />

      <section className="card space-y-4">
        <div>
          <h3 className="font-serif text-xl font-semibold">本专辑歌曲</h3>
          <p className="mt-1 text-sm text-muted">继续从单曲页进入，逐首补齐你的解读。</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {songs.map((song) => {
            const songHref = `/songs/${song.slug}` as Route
            return (
              <Link key={song.slug} href={songHref} className="rounded-xl border border-line p-4 no-underline hover:bg-paper">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{song.title}</p>
                    <p className="mt-2 text-sm text-muted">{song.summary}</p>
                  </div>
                  <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                    {song.hasDeepRead ? '有长文' : '待补长文'}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
