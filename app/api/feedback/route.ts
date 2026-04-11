import { NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

type FeedbackAttachment = {
  name: string
  type: string
  size: number
  data: string // Base64
}

type FeedbackBody = {
  name?: string
  contact?: string
  suggestion?: string
  pagePath?: string
  website?: string
  attachments?: FeedbackAttachment[]
}

function cleanText(input: unknown, limit: number): string {
  return String(input ?? '')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, limit)
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64.split(',')[1] || base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as FeedbackBody | null

  if (!body) {
    return NextResponse.json({ ok: false, message: '请求体无效。' }, { status: 400 })
  }

  // Honey pot check
  const website = cleanText(body.website, 120)
  if (website) {
    return NextResponse.json({ ok: true, message: '已接收。' })
  }

  const suggestion = cleanText(body.suggestion, 2000)
  if (suggestion.length < 5) {
    return NextResponse.json({ ok: false, message: '建议内容至少 5 个字。' }, { status: 400 })
  }

  const recordId = globalThis.crypto.randomUUID()
  const createdAt = new Date().toISOString()
  
  // Handle R2 Uploads if binding exists
  let bucket: any = null
  try {
    const ctx = getRequestContext()
    bucket = (ctx.env as any).CONTRIBUTIONS
  } catch (e) {
    // Context might not be available during local build/test
  }

  const attachmentLinks: string[] = []
  const skippedFiles: string[] = []

  if (body.attachments && body.attachments.length > 0) {
    for (const attachment of body.attachments) {
      if (bucket) {
        try {
          const fileKey = `uploads/${recordId}/${Date.now()}-${attachment.name}`
          const fileData = base64ToUint8Array(attachment.data)
          await bucket.put(fileKey, fileData, { httpMetadata: { contentType: attachment.type } })
          attachmentLinks.push(fileKey)
        } catch (err) {
          skippedFiles.push(`${attachment.name} (上传失败)`)
        }
      } else {
        skippedFiles.push(`${attachment.name} (${(attachment.size / 1024).toFixed(1)} KB)`)
      }
    }
  }

  const githubToken = cleanText(process.env.GITHUB_FEEDBACK_TOKEN, 200)
  const githubOwner = cleanText(process.env.GITHUB_FEEDBACK_OWNER, 100)
  const githubRepo = cleanText(process.env.GITHUB_FEEDBACK_REPO, 100)
  
  if (!githubToken || !githubOwner || !githubRepo) {
    return NextResponse.json({ ok: false, message: '服务端未配置 GitHub 参数。' }, { status: 503 })
  }

  const issueTitle = `[资料共建] ${cleanText(suggestion.split('\n')[0], 50)}`
  const issueBody = [
    `- 提交ID: ${recordId}`,
    `- 提交时间: ${createdAt}`,
    `- 昵称: ${cleanText(body.name, 60) || '匿名'}`,
    `- 联系方式: ${cleanText(body.contact, 120) || '未提供'}`,
    `- 页面路径: ${cleanText(body.pagePath, 120) || '未提供'}`,
    '',
    '## 描述内容',
    suggestion,
    '',
    attachmentLinks.length > 0 ? '## 已保存附件 (R2 Storage)' : '',
    ...attachmentLinks.map(link => `- ${link}`),
    skippedFiles.length > 0 ? '## 待补传附件清单 (未开启存储)' : '',
    ...skippedFiles.map(file => `- ${file}`),
    skippedFiles.length > 0 ? '\n*注：由于存储服务暂未开启，请通过联系方式联系提交者获取上述原始文件。*' : ''
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
        labels: ['contribution', 'r2-pending']
      })
    })

    if (!response.ok) {
      throw new Error('GitHub API Error')
    }

    const payload = await response.json()
    return NextResponse.json({
      ok: true,
      id: recordId,
      issueUrl: payload.html_url
    })
  } catch (error) {
    return NextResponse.json({ ok: false, message: 'GitHub 提交失败，但资料可能已保存。' }, { status: 502 })
  }
}
