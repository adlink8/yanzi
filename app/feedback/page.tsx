import { FeedbackForm } from '@/components/common/feedback-form'

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      <section className="card space-y-3">
        <h2 className="text-2xl font-semibold">建议通道</h2>
        <p className="text-sm text-muted">
          这里提交的建议会直接写入本地文件，不经过第三方平台。你可以后续批量整理再并入内容库。
        </p>
        <p className="text-xs text-muted">
          本地保存路径：<code>content/feedback/suggestions.jsonl</code>
        </p>
      </section>

      <FeedbackForm />
    </div>
  )
}
