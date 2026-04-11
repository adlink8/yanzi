import type { Route } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SongAiPanel } from '@/components/song/song-ai-panel'
import { isPlaceholderLikeText } from '@/lib/content/sanitize'
import { getAlbum, getSong, getSongDeepRead, getSongs } from '@/lib/content'
import { recommendRelatedSongs } from '@/lib/recommend/related'

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  const songs = await getSongs()
  return songs.map((song) => ({ slug: song.slug }))
}

export default async function SongDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const song = await getSong(slug)

  if (!song) {
    notFound()
  }

  const [album, deepRead, songs] = await Promise.all([getAlbum(song.albumSlug), getSongDeepRead(song.slug), getSongs()])
  const songTitleBySlug = new Map(songs.map((item) => [item.slug, item.title]))
  const relatedSongTitles = song.relatedSongs.map((relatedSlug) => songTitleBySlug.get(relatedSlug) ?? relatedSlug)
  const related = recommendRelatedSongs(song, songs)
  const hasOverview = Boolean(deepRead?.content) && !isPlaceholderLikeText(deepRead?.content)
  const hasLineByLine = Boolean(deepRead?.lyricInterpretations?.length) && deepRead!.lyricInterpretations.some((item) => !isPlaceholderLikeText(item.interpretation))
  const hasDesign = Boolean(deepRead?.songDesign) && !isPlaceholderLikeText(deepRead?.songDesign?.summary)

  return (
    <div className="space-y-6" data-era={song.era}>
      <section className="card space-y-3">
        <p className="text-sm text-muted">{album?.title ?? '未归档专辑'} · {song.era}</p>
        <h2 className="font-serif text-3xl font-semibold">{song.title}</h2>
        <p className="text-base text-muted">{song.summary}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {[...song.moodTags, ...song.themeTags].map((tag, index) => (
            <span key={`${song.slug}-${tag}-${index}`} className="rounded-full border border-line px-3 py-1 text-xs text-muted">{tag}</span>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <article className="card space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-serif text-xl font-semibold">整体解读</h3>
            {deepRead?.mvUrl ? (
              <a href={deepRead.mvUrl} target="_blank" rel="noreferrer" className="rounded-full border border-line px-4 py-2 text-sm text-muted no-underline hover:bg-paper">
                {deepRead.mvTitle ?? '打开 MV'}
              </a>
            ) : null}
          </div>
          {hasOverview ? (
            <div className="space-y-3 whitespace-pre-wrap text-sm leading-7">{deepRead?.content}</div>
          ) : (
            <p className="text-sm text-muted">这首歌已完成基础录入，整体解读将在后续继续精修。</p>
          )}
        </article>
        <aside className="card space-y-4">
          <h3 className="font-serif text-xl font-semibold">卡片信息</h3>
          <div className="space-y-2 text-sm text-muted">
            <p>关键词：{song.keywords.join('、') || '暂无'}</p>
            <p>关联歌曲：{relatedSongTitles.join('、') || '暂无'}</p>
            <p>状态：{song.status}</p>
          </div>
        </aside>
      </section>

      <section className="card space-y-4">
        <div>
          <h3 className="font-serif text-xl font-semibold">完整歌词</h3>
          <p className="mt-1 text-sm text-muted">这里支持完整歌词录入与折叠展示。</p>
        </div>
        {deepRead?.fullLyrics ? (
          <details className="rounded-2xl border border-line p-4">
            <summary className="cursor-pointer list-none text-base font-medium">展开完整歌词</summary>
            <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted">{deepRead.fullLyrics}</div>
          </details>
        ) : deepRead?.lyricBlocks?.length ? (
          <details className="rounded-2xl border border-line p-4">
            <summary className="cursor-pointer list-none text-base font-medium">展开分段歌词</summary>
            <div className="mt-4 space-y-4 text-sm leading-7 text-muted">
              {deepRead.lyricBlocks.map((block, index) => (
                <div key={index} className="whitespace-pre-wrap rounded-xl border border-line bg-paper p-3">{block}</div>
              ))}
            </div>
          </details>
        ) : (
          <p className="text-sm text-muted">你还没有录入这首歌的完整歌词。</p>
        )}
      </section>

      <section className="card space-y-4">
        <div>
          <h3 className="font-serif text-xl font-semibold">整首歌逐段 / 逐句细读</h3>
          <p className="mt-1 text-sm text-muted">仅对已完成精修的歌曲显示正式细读内容。</p>
        </div>
        {hasLineByLine ? (
          <div className="space-y-3">
            {deepRead?.lyricInterpretations.filter((item) => !isPlaceholderLikeText(item.interpretation)).map((item, index) => (
              <details key={item.id} className="rounded-2xl border border-line p-4" open={index === 0}>
                <summary className="cursor-pointer list-none pr-6 text-sm font-medium text-ink">
                  <span className="block text-xs uppercase tracking-[0.18em] text-muted">{item.section}</span>
                  <span className="mt-2 block text-base">{item.lyricText ?? item.reference}</span>
                </summary>
                <div className="mt-4 space-y-3 text-sm text-muted">
                  {!item.lyricText ? <p>锚点：{item.reference}</p> : null}
                  <p className="whitespace-pre-wrap leading-7">{item.interpretation}</p>
                  {item.whyItMatters ? <div className="rounded-xl border border-line bg-paper p-3"><p className="text-xs uppercase tracking-[0.16em] text-muted">为什么重要</p><p className="mt-2 whitespace-pre-wrap leading-7">{item.whyItMatters}</p></div> : null}
                </div>
              </details>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">这首歌已录入，但逐段/逐句细读仍待后续精修。</p>
        )}
      </section>

      <section className="card space-y-4">
        <div>
          <h3 className="font-serif text-xl font-semibold">整首歌设计分析</h3>
          <p className="mt-1 text-sm text-muted">仅对已完成精修的歌曲显示正式设计分析。</p>
        </div>
        {hasDesign ? (
          <div className="space-y-3">
            {deepRead?.songDesign?.summary ? <div className="rounded-2xl border border-line p-4"><p className="text-sm leading-7 text-muted">{deepRead.songDesign.summary}</p></div> : null}
            {deepRead?.songDesign?.structure?.length ? <details className="rounded-2xl border border-line p-4" open><summary className="cursor-pointer list-none text-base font-medium">结构设计</summary><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted">{deepRead.songDesign.structure.map((item) => <li key={item}>{item}</li>)}</ul></details> : null}
            {deepRead?.songDesign?.emotionCurve?.length ? <details className="rounded-2xl border border-line p-4"><summary className="cursor-pointer list-none text-base font-medium">情绪推进</summary><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted">{deepRead.songDesign.emotionCurve.map((item) => <li key={item}>{item}</li>)}</ul></details> : null}
            {deepRead?.songDesign?.craftNotes?.length ? <details className="rounded-2xl border border-line p-4"><summary className="cursor-pointer list-none text-base font-medium">写法观察</summary><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted">{deepRead.songDesign.craftNotes.map((item) => <li key={item}>{item}</li>)}</ul></details> : null}
          </div>
        ) : (
          <p className="text-sm text-muted">这首歌已录入，但整首歌设计分析仍待后续精修。</p>
        )}
      </section>

      <SongAiPanel slug={song.slug} title={song.title} />

      <section className="card space-y-4">
        <div>
          <h3 className="font-serif text-xl font-semibold">同主题推荐</h3>
          <p className="mt-1 text-sm text-muted">根据同专辑、情绪标签、主题标签和站内关联关系推荐下一首。</p>
        </div>
        {related.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {related.map((item) => {
              const songHref = `/songs/${item.song.slug}` as Route
              return (
                <Link key={item.song.slug} href={songHref} className="rounded-2xl border border-line p-4 no-underline hover:bg-paper">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{item.song.title}</p>
                      <p className="mt-2 text-sm text-muted">{item.song.summary}</p>
                    </div>
                    <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">{item.song.hasDeepRead ? '可深读' : '仅卡片'}</span>
                  </div>
                  <p className="mt-3 text-xs text-muted">推荐理由：{item.reasons.join('；')}</p>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted">暂时还没有足够相近的歌曲样本。</p>
        )}
      </section>
    </div>
  )
}
