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

  it('filters scaffold interpretation units for shang-bu-liao', async () => {
    const deepRead = await getSongDeepRead('shang-bu-liao')
    expect(deepRead).not.toBeNull()
    // Content file cleaned; loader also drops any residual scaffold units
    expect(deepRead?.lyricInterpretations ?? []).toEqual([])
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
