import { NextResponse } from 'next/server'

export const runtime = 'edge'

type FeedbackBody = {
  name?: string
  contact?: string
  suggestion?: string
  pagePath?: string
  website?: string
}

function cleanText(input: unknown, limit: number): string {
  return String(input ?? '')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, limit)
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as FeedbackBody | null

  if (!body) {
    return NextResponse.json({ ok: false, message: '请求体无效。' }, { status: 400 })
  }

  const website = cleanText(body.website, 120)
  if (website) {
    return NextResponse.json({ ok: true, message: '已接收。' })
  }

  const suggestion = cleanText(body.suggestion, 2000)
  if (suggestion.length < 5) {
    return NextResponse.json({ ok: false, message: '建议内容至少 5 个字。' }, { status: 400 })
  }

  const record = {
    id: globalThis.crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: cleanText(body.name, 60) || null,
    contact: cleanText(body.contact, 120) || null,
    pagePath: cleanText(body.pagePath, 120) || null,
    suggestion,
    sourceIp: cleanText(request.headers.get('x-forwarded-for') || '', 80) || null,
    userAgent: cleanText(request.headers.get('user-agent') || '', 240) || null
  }

  const webhookUrl = cleanText(process.env.FEEDBACK_WEBHOOK_URL, 500)
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(record)
      })
      return NextResponse.json({ ok: true, id: record.id })
    } catch {
      return NextResponse.json({ ok: false, message: 'Webhook 投递失败。' }, { status: 502 })
    }
  }

  return NextResponse.json({
    ok: true,
    id: record.id,
    message: '建议已接收。当前未配置持久化存储，请设置 FEEDBACK_WEBHOOK_URL。'
  })
}
