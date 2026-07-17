import { describe, expect, it } from 'vitest'
import {
  buildAlbumContext,
  buildAlbumPrompt,
  buildSongContext,
  buildSongPrompt
} from '@/lib/ai/context-builders'
import { makeAlbum, makeDeepRead, makeSong } from '../helpers/fixtures'

describe('AI context builders', () => {
  const song = makeSong()
  const album = makeAlbum()

  it('buildSongContext includes deep-read fields when provided', () => {
    const text = buildSongContext(song, album, makeDeepRead())
    expect(text).toContain('歌曲：天黑黑')
    expect(text).toContain('整体解读：')
    expect(text).toContain('完整歌词（用户录入）：')
    expect(text).toContain('逐段/逐句解读：')
    expect(text).toContain('整首歌设计分析：')
    expect(text).toContain('MV链接：https://example.com/mv')
  })

  it('buildAlbumContext lists album metadata and song count', () => {
    const text = buildAlbumContext(album, [song, makeSong({ slug: 'b' })])
    expect(text).toContain('专辑：孙燕姿同名专辑')
    expect(text).toContain('收录歌曲数：2')
  })

  it('buildSongPrompt / buildAlbumPrompt use constrained system prompts', () => {
    const songMessages = buildSongPrompt(song, album, '这首歌在说什么？')
    expect(songMessages).toHaveLength(2)
    expect(songMessages[0]?.role).toBe('system')
    expect(songMessages[0]?.content).toContain('只能基于提供的站内资料')
    expect(songMessages[1]?.content).toContain('这首歌在说什么？')
    expect(songMessages[1]?.content).toContain('天黑黑')

    const albumMessages = buildAlbumPrompt(album, [song], '专辑气质？')
    expect(albumMessages).toHaveLength(2)
    expect(albumMessages[0]?.content).toContain('只能基于提供的专辑资料')
    expect(albumMessages[1]?.content).toContain('专辑气质？')
  })
})
