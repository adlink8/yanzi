'use client'

import { useState, useRef } from 'react'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'
type AttachedFile = {
  id: string
  file: File
  preview: string
}

export function FeedbackForm() {
  const [state, setState] = useState<SubmitState>('idle')
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<AttachedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const webhookUrl = process.env.NEXT_PUBLIC_FEEDBACK_WEBHOOK_URL?.trim()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const newAttachments: AttachedFile[] = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
    }))
    setAttachments(prev => [...prev, ...newAttachments])
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id))
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('submitting')
    setMessage('')

    const form = event.currentTarget
    const formData = new FormData(form)
    
    // Prepare attachments
    const processedAttachments = await Promise.all(
      attachments.map(async (a) => ({
        name: a.file.name,
        type: a.file.type,
        size: a.file.size,
        data: await fileToBase64(a.file)
      }))
    )

    const payload = {
      name: String(formData.get('name') || ''),
      contact: String(formData.get('contact') || ''),
      suggestion: String(formData.get('suggestion') || ''),
      pagePath: String(formData.get('pagePath') || ''),
      website: String(formData.get('website') || ''),
      attachments: processedAttachments
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = (await response.json().catch(() => null)) as { message?: string } | null

      if (!response.ok) {
        if (!webhookUrl) {
          setState('error')
          setMessage(result?.message ?? '提交失败，请稍后再试。')
          return
        }

        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!webhookResponse.ok) {
          setState('error')
          setMessage('提交失败，请稍后再试。')
          return
        }

        setState('success')
        setMessage('资料已收到（通过备用通道）。')
        form.reset()
        setAttachments([])
        return
      }

      setState('success')
      setMessage('资料与留言已提交，感谢共建！')
      form.reset()
      setAttachments([])
    } catch (error) {
      console.error(error)
      setState('error')
      setMessage('网络异常，提交失败。')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="name" className="text-xs uppercase tracking-widest text-muted">昵称（可选）</label>
          <input
            id="name"
            name="name"
            maxLength={60}
            className="w-full rounded-2xl border border-line bg-white/50 px-4 py-2.5 text-sm outline-none focus:border-accent"
            placeholder="比如：一个老歌迷"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="contact" className="text-xs uppercase tracking-widest text-muted">联系方式（可选）</label>
          <input
            id="contact"
            name="contact"
            maxLength={120}
            className="w-full rounded-2xl border border-line bg-white/50 px-4 py-2.5 text-sm outline-none focus:border-accent"
            placeholder="邮箱 / 微信 / 其它"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="suggestion" className="text-xs uppercase tracking-widest text-muted">内容描述</label>
        <textarea
          id="suggestion"
          name="suggestion"
          required
          minLength={5}
          maxLength={2000}
          rows={5}
          className="w-full rounded-2xl border border-line bg-white/50 px-4 py-3 text-sm outline-none focus:border-accent"
          placeholder="请简要描述你上传的资料内容，或直接写下建议。"
        />
      </div>

      <div className="space-y-3">
        <label className="text-xs uppercase tracking-widest text-muted">资料上传 (照片/文档)</label>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex min-h-[120px] cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-line bg-white/30 transition-all hover:border-accent hover:bg-white/50"
        >
          <div className="text-center">
            <p className="text-sm font-medium text-ink group-hover:text-accent">点击或拖拽文件到这里</p>
            <p className="mt-1 text-xs text-muted">JPG, PNG, WEBP, PDF, TXT (每个最大 5MB)</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            multiple 
            accept="image/*,.pdf,.txt" 
            className="hidden" 
          />
        </div>

        {attachments.length > 0 && (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {attachments.map((a) => (
              <div key={a.id} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-white">
                {a.preview ? (
                  <img src={a.preview} alt="preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-paper p-2 text-center text-[10px] text-muted">
                    {a.file.name}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeAttachment(a.id)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 pt-2">
        <button
          type="submit"
          disabled={state === 'submitting'}
          className="w-full rounded-full bg-ink py-3 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === 'submitting' ? (
            <span className="flex items-center justify-center gap-2">
               <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
               正在提交中...
            </span>
          ) : '正式提交资料与留言'}
        </button>
        <p className={`text-center text-sm ${state === 'error' ? 'text-red-600 font-medium' : 'text-muted'}`}>
          {message}
        </p>
      </div>
    </form>
  )
}
