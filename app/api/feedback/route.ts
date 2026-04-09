import { randomUUID } from 'node:crypto'
import { appendFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

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

  const name = cleanText(body.name, 60)
  const contact = cleanText(body.contact, 120)
  const pagePath = cleanText(body.pagePath, 120)
  const forwardedFor = request.headers.get('x-forwarded-for') || ''
  const userAgent = request.headers.get('user-agent') || ''

  const record = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    name: name || null,
    contact: contact || null,
    pagePath: pagePath || null,
    suggestion,
    sourceIp: cleanText(forwardedFor.split(',')[0] || '', 80) || null,
    userAgent: cleanText(userAgent, 240) || null
  }

  const dir = path.join(process.cwd(), 'content', 'feedback')
  const filePath = path.join(dir, 'suggestions.jsonl')

  try {
    await mkdir(dir, { recursive: true })
    await appendFile(filePath, `${JSON.stringify(record)}\n`, 'utf8')
    return NextResponse.json({ ok: true, id: record.id })
  } catch {
    return NextResponse.json({ ok: false, message: '写入本地失败。' }, { status: 500 })
  }
}
