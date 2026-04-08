'use client'

import { useState } from 'react'

type SongAiPanelProps = { slug: string; title: string }
type ApiResult = { ok: boolean; answer?: string; message?: string }

export function SongAiPanel({ slug, title }: SongAiPanelProps) {
  const [question, setQuestion] = useState('这首歌最打动人的地方是什么？')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAsk(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/ask/song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, question })
      })
      const data = (await response.json()) as ApiResult
      if (!response.ok || !data.ok) throw new Error(data.message || '请求失败')
      setAnswer(data.answer || '')
    } catch (requestError) {
      setAnswer('')
      setError(requestError instanceof Error ? requestError.message : '请求失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card space-y-4">
      <div>
        <h3 className="text-xl font-semibold">AI 解读助手</h3>
        <p className="mt-1 text-sm text-muted">围绕《{title}》做进一步提问。当前回答仅基于站内资料，不扮演本人。</p>
      </div>
      <form className="space-y-3" onSubmit={handleAsk}>
        <textarea className="min-h-28 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="比如：这首歌为什么会让人反复回听？" />
        <button type="submit" disabled={loading || !question.trim()} className="rounded-full bg-ink px-5 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? '思考中…' : '开始提问'}
        </button>
      </form>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {answer ? <div className="space-y-2 rounded-2xl border border-line bg-paper p-4"><p className="text-sm font-medium">回答</p><p className="whitespace-pre-wrap text-sm leading-7 text-muted">{answer}</p></div> : null}
    </section>
  )
}