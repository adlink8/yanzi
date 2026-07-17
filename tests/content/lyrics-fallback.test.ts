import { describe, expect, it } from 'vitest'
import { getSongDeepRead } from '@/lib/content'
import {
  isLyricsPlaceholderDocument,
  resolveRealFullLyrics
} from '@/lib/content/sanitize'

describe('lyrics fallback / placeholder filtering (READ-03 / META-03)', () => {
  it('does not surface placeholder raw-lyrics as fullLyrics for shang-bu-liao', async () => {
    const deepRead = await getSongDeepRead('shang-bu-liao')
    expect(deepRead).not.toBeNull()
    expect(deepRead?.fullLyrics).toBeUndefined()
    expect(deepRead?.lyricBlocks ?? []).toEqual([])
  })

  it('allows honest non-scaffold notes for shang-bu-liao without fake lyrics', async () => {
    const deepRead = await getSongDeepRead('shang-bu-liao')
    expect(deepRead).not.toBeNull()
    // May include editorial notes while lyrics are pending; must not use scaffold stubs
    const units = deepRead?.lyricInterpretations ?? []
    expect(units.length).toBeGreaterThan(0)
    for (const unit of units) {
      expect(unit.interpretation).not.toMatch(/自动补充的第|情绪结构样本|开场句|中段句/)
      expect(unit.lyricText).not.toMatch(/^(开场句|中段句|转折句|结尾句)$/)
    }
    expect(deepRead?.fullLyrics).toBeUndefined()
  })

  it('keeps real raw lyrics for a known complete song', async () => {
    const deepRead = await getSongDeepRead('tian-hei-hei')
    expect(deepRead).not.toBeNull()
    expect(deepRead?.fullLyrics).toBeTruthy()
    expect(isLyricsPlaceholderDocument(deepRead!.fullLyrics)).toBe(false)
    expect(deepRead!.fullLyrics).toContain('天黑黑')
  })

  it('resolveRealFullLyrics never returns meta placeholder bodies', () => {
    const meta = '[待补录] 《演示》歌词\n补录要求：仅写歌词正文'
    expect(resolveRealFullLyrics(meta, '也待补录')).toBeUndefined()
  })
})
