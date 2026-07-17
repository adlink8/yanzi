import { describe, expect, it } from 'vitest'
import {
  humanizeSlug,
  isCorruptedText,
  isLyricsPlaceholderDocument,
  isPlaceholderLikeText,
  isScaffoldInterpretationUnit,
  isScaffoldLyricText,
  resolveRealFullLyrics,
  sanitizeMultilineText,
  sanitizeText,
  sanitizeTextArray
} from '@/lib/content/sanitize'

describe('content sanitize helpers', () => {
  it('humanizeSlug converts kebab-case', () => {
    expect(humanizeSlug('tian-hei-hei')).toBe('Tian Hei Hei')
    expect(humanizeSlug('')).toBe('未命名条目')
  })

  it('detects corrupted and placeholder text', () => {
    expect(isCorruptedText('正常中文')).toBe(false)
    expect(isCorruptedText('????broken')).toBe(true)
    expect(isPlaceholderLikeText('待补充内容')).toBe(true)
    expect(isPlaceholderLikeText('[待补录] 《上不了》歌词')).toBe(true)
    expect(isPlaceholderLikeText('自动补充的第 5 段解读')).toBe(true)
    expect(isPlaceholderLikeText('情绪结构样本')).toBe(true)
    expect(isPlaceholderLikeText('真实摘要')).toBe(false)
  })

  it('sanitizeText falls back for empty/placeholder', () => {
    expect(sanitizeText('  天黑黑  ')).toBe('天黑黑')
    expect(sanitizeText('待补充', 'fallback')).toBe('fallback')
    expect(sanitizeTextArray(['天黑黑', '待补充', ''])).toEqual(['天黑黑'])
  })

  it('sanitizeMultilineText drops placeholder lines but keeps blanks structure', () => {
    const input = '第一行\n\n待补充\n第三行'
    expect(sanitizeMultilineText(input)).toBe('第一行\n\n第三行')
  })

  it('treats lyrics placeholder documents as non-displayable full lyrics', () => {
    const placeholderDoc = `[待补录] 《上不了》歌词

当前仓库未找到可验证的完整歌词来源，先创建占位文件用于流程闭环。

补录要求：
1. 使用 UTF-8 编码`

    expect(isLyricsPlaceholderDocument(placeholderDoc)).toBe(true)
    expect(resolveRealFullLyrics(placeholderDoc, undefined)).toBeUndefined()
    expect(resolveRealFullLyrics(null, placeholderDoc)).toBeUndefined()
  })

  it('prefers real raw lyrics over frontmatter and falls back when raw is placeholder', () => {
    const real = '我的小时候吵闹任性的时候\n天黑黑 欲落雨'
    const placeholder = '[待补录] 歌词\n补录要求：UTF-8'

    expect(resolveRealFullLyrics(real, 'frontmatter line')).toBe(real)
    expect(resolveRealFullLyrics(placeholder, real)).toBe(real)
    expect(resolveRealFullLyrics(null, real)).toBe(real)
    expect(resolveRealFullLyrics(placeholder, placeholder)).toBeUndefined()
    expect(resolveRealFullLyrics(null, null)).toBeUndefined()
  })

  it('detects scaffold lyricText stubs and interpretation units', () => {
    expect(isScaffoldLyricText('开场句')).toBe(true)
    expect(isScaffoldLyricText('中段句')).toBe(true)
    expect(isScaffoldLyricText('《上不了》 语句 5')).toBe(true)
    expect(isScaffoldLyricText('天黑黑 欲落雨')).toBe(false)

    expect(
      isScaffoldInterpretationUnit({
        section: '开场锚点',
        reference: '开场第一组歌词把语气先定住',
        lyricText: '开场句',
        interpretation: '这一句的价值在于先立气质。'
      })
    ).toBe(true)

    expect(
      isScaffoldInterpretationUnit({
        section: '自动补充段 5',
        reference: '《上不了》 第 5 段',
        lyricText: '《上不了》 语句 5',
        interpretation: '这是《上不了》自动补充的第 5 段解读，主要呼应整体主题。'
      })
    ).toBe(true)

    expect(
      isScaffoldInterpretationUnit({
        section: '主歌',
        reference: '童年记忆',
        lyricText: '我的小时候吵闹任性的时候',
        interpretation: '外婆的歌成为情绪安抚的第一层记忆。'
      })
    ).toBe(false)
  })
})
