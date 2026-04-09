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

  const githubToken = cleanText(process.env.GITHUB_FEEDBACK_TOKEN, 200)
  const githubOwner = cleanText(process.env.GITHUB_FEEDBACK_OWNER, 100)
  const githubRepo = cleanText(process.env.GITHUB_FEEDBACK_REPO, 100)
  const labelsRaw = cleanText(process.env.GITHUB_FEEDBACK_LABELS, 200)
  const labels = labelsRaw
    ? labelsRaw.split(',').map((item) => item.trim()).filter(Boolean)
    : ['feedback']

  if (!githubToken || !githubOwner || !githubRepo) {
    return NextResponse.json(
      {
        ok: false,
        message: '服务端未配置 GitHub Issue 参数，请联系站点维护者。'
      },
      { status: 503 }
    )
  }

  const headline = cleanText(suggestion.split('\n')[0] || '站点建议', 50)
  const issueTitle = `[建议] ${headline || '站点建议'}`
  const issueBody = [
    `- 提交ID: ${record.id}`,
    `- 提交时间: ${record.createdAt}`,
    `- 昵称: ${record.name ?? '匿名'}`,
    `- 联系方式: ${record.contact ?? '未提供'}`,
    `- 页面路径: ${record.pagePath ?? '未提供'}`,
    `- 来源IP: ${record.sourceIp ?? '未提供'}`,
    `- User-Agent: ${record.userAgent ?? '未提供'}`,
    '',
    '## 建议内容',
    record.suggestion
  ].join('\n')

  try {
    const response = await fetch(`https://api.github.com/repos/${githubOwner}/${githubRepo}/issues`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${githubToken}`,
        accept: 'application/vnd.github+json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels
      })
    })

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null
      return NextResponse.json(
        { ok: false, message: payload?.message ?? 'GitHub Issue 创建失败。' },
        { status: 502 }
      )
    }

    const payload = (await response.json().catch(() => null)) as { html_url?: string; number?: number } | null
    return NextResponse.json({
      ok: true,
      id: record.id,
      issueUrl: payload?.html_url ?? null,
      issueNumber: payload?.number ?? null
    })
  } catch {
    return NextResponse.json({ ok: false, message: '连接 GitHub 失败。' }, { status: 502 })
  }
}
