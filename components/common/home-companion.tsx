'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useMemo, useState } from 'react'

type CompanionSong = {
  slug: string
  title: string
  summary: string
  moodTags: string[]
  themeTags: string[]
}

type HomeCompanionProps = {
  dailySong: CompanionSong | null
  randomPool: CompanionSong[]
}

export function HomeCompanion({ dailySong, randomPool }: HomeCompanionProps) {
  const [randomSong, setRandomSong] = useState<CompanionSong | null>(null)

  const dailyHref = useMemo(() => {
    return dailySong ? (`/songs/${dailySong.slug}` as Route) : null
  }, [dailySong])

  function handlePickRandom() {
    if (randomPool.length === 0) return
    const index = Math.floor(Math.random() * randomPool.length)
    setRandomSong(randomPool[index] ?? null)
  }

  return (
    <section className="grid gap-6 md:grid-cols-2">
      <div className="card space-y-4">
        <div>
          <h2 className="text-xl font-semibold">今天适合听什么</h2>
          <p className="mt-1 text-sm text-muted">每天给你一首站内优先回看的歌，适合慢慢重听。</p>
        </div>

        {dailySong && dailyHref ? (
          <Link href={dailyHref} className="block rounded-2xl border border-line p-4 no-underline hover:bg-paper">
            <p className="text-lg font-medium">{dailySong.title}</p>
            <p className="mt-2 text-sm text-muted">{dailySong.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[...dailySong.moodTags, ...dailySong.themeTags].slice(0, 5).map((tag) => (
                <span key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-muted">{tag}</span>
              ))}
            </div>
          </Link>
        ) : (
          <p className="text-sm text-muted">还没有可推荐的歌曲样本。</p>
        )}
      </div>

      <div className="card space-y-4">
        <div>
          <h2 className="text-xl font-semibold">随机回听一首</h2>
          <p className="mt-1 text-sm text-muted">当你不确定听什么时，交给这个入口。</p>
        </div>

        <button type="button" onClick={handlePickRandom} className="rounded-full bg-ink px-5 py-2 text-sm text-white">
          随机来一首
        </button>

        {randomSong ? (
          <Link href={`/songs/${randomSong.slug}` as Route} className="block rounded-2xl border border-line p-4 no-underline hover:bg-paper">
            <p className="text-lg font-medium">{randomSong.title}</p>
            <p className="mt-2 text-sm text-muted">{randomSong.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[...randomSong.moodTags, ...randomSong.themeTags].slice(0, 5).map((tag) => (
                <span key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-muted">{tag}</span>
              ))}
            </div>
          </Link>
        ) : (
          <p className="text-sm text-muted">点击按钮，抽一首歌来回听。</p>
        )}
      </div>
    </section>
  )
}