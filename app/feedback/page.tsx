import { FeedbackForm } from '@/components/common/feedback-form'

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      <section className="card space-y-3">
        <h2 className="text-2xl font-semibold">建议通道</h2>
        <p className="text-sm text-muted">
          这里提交的建议会自动创建 GitHub Issue，便于你和协作者统一追踪与处理。
        </p>
        <p className="text-xs text-muted">
          需要配置环境变量：<code>GITHUB_FEEDBACK_TOKEN</code>、<code>GITHUB_FEEDBACK_OWNER</code>、<code>GITHUB_FEEDBACK_REPO</code>
        </p>
      </section>

      <FeedbackForm />
    </div>
  )
}
