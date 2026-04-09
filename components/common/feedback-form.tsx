'use client'

import { useState } from 'react'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function FeedbackForm() {
  const [state, setState] = useState<SubmitState>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('submitting')
    setMessage('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get('name') || ''),
      contact: String(formData.get('contact') || ''),
      suggestion: String(formData.get('suggestion') || ''),
      pagePath: String(formData.get('pagePath') || ''),
      website: String(formData.get('website') || '')
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = (await response.json().catch(() => null)) as { message?: string } | null

      if (!response.ok) {
        setState('error')
        setMessage(result?.message ?? '提交失败，请稍后再试。')
        return
      }

      setState('success')
      setMessage('建议已收到，并已保存到本地。')
      form.reset()
    } catch {
      setState('error')
      setMessage('网络异常，建议未提交成功。')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm text-muted">昵称（可选）</label>
        <input
          id="name"
          name="name"
          maxLength={60}
          className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink"
          placeholder="比如：一个老歌迷"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="contact" className="text-sm text-muted">联系方式（可选）</label>
        <input
          id="contact"
          name="contact"
          maxLength={120}
          className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink"
          placeholder="邮箱 / 微信 / 其它"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="pagePath" className="text-sm text-muted">建议针对页面（可选）</label>
        <input
          id="pagePath"
          name="pagePath"
          maxLength={120}
          className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink"
          placeholder="/songs/tian-hei-hei"
        />
      </div>

      <div className="hidden">
        <label htmlFor="website">网站</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-1">
        <label htmlFor="suggestion" className="text-sm text-muted">建议内容</label>
        <textarea
          id="suggestion"
          name="suggestion"
          required
          minLength={5}
          maxLength={2000}
          rows={6}
          className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink"
          placeholder="请写下你希望补充、修改或优化的内容。"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={state === 'submitting'}
          className="rounded-full bg-ink px-5 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === 'submitting' ? '提交中...' : '提交建议'}
        </button>
        <p
          className={`text-sm ${
            state === 'error' ? 'text-red-600' : 'text-muted'
          }`}
          aria-live="polite"
        >
          {message}
        </p>
      </div>
    </form>
  )
}
