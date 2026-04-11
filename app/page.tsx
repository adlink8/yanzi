import type { Route } from 'next'
import Link from 'next/link'
import { HomeCompanion } from '@/components/common/home-companion'
import { MoodRecommender } from '@/components/common/mood-recommender'
import { getAlbums, getSongs, getTags } from '@/lib/content'
import { pickDailySong } from '@/lib/recommend/daily'

export default async function HomePage() {
  const [songs, albums, tags] = await Promise.all([getSongs(), getAlbums(), getTags()])
  const featured = songs.filter((song) => song.favoriteLevel === 'high').slice(0, 3)
  const dailySong = pickDailySong(songs)
  const randomPool = songs
    .filter((song) => song.favoriteLevel !== 'low')
    .map((song) => ({
      slug: song.slug,
      title: song.title,
      summary: song.summary,
      moodTags: song.moodTags,
      themeTags: song.themeTags
    }))

  return (
    <div className="space-y-8" data-era="日落">
      <section className="card space-y-4">
        <p className="text-sm text-muted">一个由粉丝长期维护的孙燕姿作品图书馆与解读助手。</p>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-2xl font-semibold">{songs.length}</p>
            <p className="text-sm text-muted">首歌曲</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{albums.length}</p>
            <p className="text-sm text-muted">个专辑 / 单曲条目</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{tags.length}</p>
            <p className="text-sm text-muted">个主题标签</p>
          </div>
        </div>
      </section>

      <HomeCompanion
        dailySong={dailySong ? {
          slug: dailySong.slug,
          title: dailySong.title,
          summary: dailySong.summary,
          moodTags: dailySong.moodTags,
          themeTags: dailySong.themeTags,
          era: dailySong.era
        } : null}
        randomPool={randomPool.map(s => ({ ...s, era: songs.find(so => so.slug === s.slug)?.era ?? '' }))}
      />

      <MoodRecommender />

      <section className="grid gap-6 md:grid-cols-2">
        <div className="card space-y-3">
          <h2 className="font-serif text-xl font-semibold">优先回看</h2>
          {featured.map((song) => {
            const songHref = `/songs/${song.slug}` as Route
            return (
              <Link key={song.slug} href={songHref} className="block rounded-xl border border-line p-4 no-underline hover:bg-paper" data-era={song.era}>
                <p className="font-serif font-medium">{song.title}</p>
                <p className="mt-1 text-sm text-muted">{song.summary}</p>
              </Link>
            )
          })}
        </div>

        <div className="card space-y-3">
          <h2 className="font-serif text-xl font-semibold">当前阶段</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
            <li>歌曲已全量录入</li>
            <li>基础深读已全量覆盖</li>
            <li>下一步重点是把临时归档回填到正式专辑并持续精修</li>
          </ul>
        </div>
      </section>
    </div>
  )
}