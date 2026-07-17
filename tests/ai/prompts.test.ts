import { describe, expect, it } from 'vitest'
import {
  buildAlbumSystemPrompt,
  buildAlbumUserPrompt,
  buildSongSystemPrompt,
  buildSongUserPrompt
} from '@/lib/ai/prompts'

describe('AI prompt builders', () => {
  it('system prompts forbid fabricating off-site claims', () => {
    const song = buildSongSystemPrompt()
    const album = buildAlbumSystemPrompt()
    expect(song).toContain('只能基于提供的站内资料')
    expect(song).toContain('不要编造')
    expect(album).toContain('只能基于提供的专辑资料')
  })

  it('user prompts embed context and question', () => {
    expect(buildSongUserPrompt('ctx', 'q1')).toContain('ctx')
    expect(buildSongUserPrompt('ctx', 'q1')).toContain('q1')
    expect(buildAlbumUserPrompt('album-ctx', 'q2')).toContain('album-ctx')
    expect(buildAlbumUserPrompt('album-ctx', 'q2')).toContain('q2')
  })
})
