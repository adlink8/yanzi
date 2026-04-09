import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      code: 'EDGE_RUNTIME_DISABLED',
      message: 'Cloudflare Pages 部署下暂未启用专辑 AI 问答。'
    },
    { status: 503 }
  )
}
