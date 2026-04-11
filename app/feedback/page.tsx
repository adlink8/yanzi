import { FeedbackForm } from '@/components/common/feedback-form'

export default function FeedbackPage() {
  return (
    <div className="space-y-10" data-era="日落">
      <section className="card space-y-4">
        <h2 className="font-serif text-3xl font-semibold">燕姿档案库 (Contribution Hub)</h2>
        <div className="space-y-4">
          <p className="text-base leading-7 text-muted">
            每一个深读站的背后，都离不开歌迷长期的共建。无论是一张高清扫描的专辑内页、一段珍贵的访谈文字，还是你对某首歌的独特感悟，
            我们都非常欢迎你将其上传至此。
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted font-sans">
            <li>支持图片 (JPG/PNG/WEBP) 与文档 (PDF/TXT)</li>
            <li>资料将由系统自动整理，并在确认后署名收录</li>
            <li>资料提交后会自动创建 GitHub Issue 进行跟进</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="font-serif text-xl font-semibold px-2">资料提交与留言</h3>
        <FeedbackForm />
      </section>
    </div>
  )
}
