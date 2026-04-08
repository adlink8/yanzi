import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Stefanie Sun Deep Reads',
  description: '孙燕姿作品深度解读站（私有自用版）'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <main>
          <header className="mb-10 flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted">Private self-use</p>
              <h1 className="mt-2 text-3xl font-semibold">Stefanie Sun Deep Reads</h1>
              <p className="mt-2 text-sm text-muted">孙燕姿作品深度解读站</p>
            </div>
            <nav className="flex gap-4 text-sm text-muted">
              <Link href="/">首页</Link>
              <Link href="/songs">歌曲</Link>
              <Link href="/albums">专辑</Link>
              <Link href="/timeline">时间线</Link>
            </nav>
          </header>
          {children}
        </main>
      </body>
    </html>
  )
}