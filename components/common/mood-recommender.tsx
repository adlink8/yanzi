'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useMemo, useState } from 'react'

type RecommendationItem = {
  score: number
  reasons: string[]
  song: {
    slug: string
    title: string
    summary: string
    moodTags: string[]
    themeTags: string[]
    favoriteLevel?: 'low' | 'medium' | 'high'
    hasDeepRead: boolean
  }
}

type ApiResult = {
  ok: boolean
  recommendations?: RecommendationItem[]
}

const moodOptions = ['治愈', '孤独', '成长', '温柔', '想念', '释然']

export function MoodRecommender() {
  const [mood, setMood] = useState('治愈')
  const [items, setItems] = useState<RecommendationItem[]>([])
  const [loading, setLoading] = useState(false)
  const [asked, setAsked] = useState(false)

  const canSubmit = useMemo(() => mood.trim().length > 0, [mood])

  async function handleRecommend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    try {
      const response = await fetch('/api/recommend/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood })
      })
      const data = (await response.json()) as ApiResult
      setItems(data.recommendations ?? [])
      setAsked(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card space-y-4">
      <div>
        <h2 className="text-xl font-semibold">按情绪推荐歌曲</h2>
        <p className="mt-1 text-sm text-muted">输入一个情绪词，先用站内标签和摘要帮你找更适合回听的歌。</p>
      </div>

      <form className="space-y-3" onSubmit={handleRecommend}>
        <div className="flex flex-wrap gap-2">
          {moodOptions.map((option) => (
            <button key={option} type="button" className={`rounded-full border px-3 py-1 text-sm ${mood === option ? 'border-accent text-accent' : 'border-line text-muted'}`} onClick={() => setMood(option)}>
              {option}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <input className="flex-1 rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-accent" value={mood} onChange={(event) => setMood(event.target.value)} placeholder="比如：治愈、孤独、想念、成长" />
          <button type="submit" disabled={!canSubmit || loading} className="rounded-full bg-ink px-5 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? '推荐中…' : '开始推荐'}
          </button>
        </div>
      </form>

      {asked ? (
        <div className="space-y-3">
          {items.length > 0 ? items.map((item) => {
            const songHref = `/songs/${item.song.slug}` as Route
            return (
              <Link key={item.song.slug} href={songHref} className="block rounded-2xl border border-line p-4 no-underline hover:bg-paper">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{item.song.title}</p>
                    <p className="mt-2 text-sm text-muted">{item.song.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[...item.song.moodTags, ...item.song.themeTags].slice(0, 5).map((tag, index) => (
                        <span key={`${item.song.slug}-${tag}-${index}`} className="rounded-full border border-line px-3 py-1 text-xs text-muted">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">{item.song.hasDeepRead ? '可深读' : '仅卡片'}</span>
                </div>
                <p className="mt-3 text-xs text-muted">推荐理由：{item.reasons.join('；')}</p>
              </Link>
            )
          }) : <p className="text-sm text-muted">暂时没有找到合适结果。</p>}
        </div>
      ) : null}
    </section>
  )
}
