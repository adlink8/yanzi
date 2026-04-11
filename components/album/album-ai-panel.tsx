'use client'

import { useState } from 'react'

type AlbumAiPanelProps = { slug: string; title: string }

export function AlbumAiPanel({ slug, title }: AlbumAiPanelProps) {
  const [question, setQuestion] = useState('这张专辑的核心气质是什么？')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAsk(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setAnswer('')

    try {
      const response = await fetch('/api/ask/album', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, question })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || '请求失败')
      }

      if (!response.body) throw new Error('无法读取响应流')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let currentAnswer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            
            try {
              const json = JSON.parse(data)
              const content = json.choices?.[0]?.delta?.content || ''
              currentAnswer += content
              setAnswer(currentAnswer)
            } catch (e) {
              // Ignore parse errors for partial chunks
            }
          }
        }
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '请求失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card space-y-4">
      <div>
        <h3 className="font-serif text-xl font-semibold">AI 专辑导览</h3>
        <p className="mt-1 text-sm text-muted">围绕《{title}》继续提问。当前回答仅基于站内专辑资料与歌曲摘要。</p>
      </div>
      <form className="space-y-3" onSubmit={handleAsk}>
        <textarea className="min-h-28 w-full rounded-2xl border border-line bg-white/50 px-4 py-3 text-sm outline-none focus:border-accent" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="比如：这张专辑适合从什么角度理解？" />
        <button type="submit" disabled={loading || !question.trim()} className="rounded-full bg-ink px-6 py-2.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]">
          {loading && !answer ? '思考中…' : loading ? '正在回答…' : '开始提问'}
        </button>
      </form>
      {error ? <p className="text-sm text-red-600 px-2">{error}</p> : null}
      {answer ? (
        <div className="space-y-2 rounded-2xl border border-line bg-paper/50 p-5 animate-in fade-in slide-in-from-top-2 duration-500">
          <p className="text-xs uppercase tracking-widest text-muted">AI 回答</p>
          <p className="whitespace-pre-wrap text-sm leading-7 text-ink">{answer}</p>
        </div>
      ) : null}
    </section>
  )
}
