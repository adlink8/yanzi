import { describe, expect, it } from 'vitest'
import {
  humanizeSlug,
  isCorruptedText,
  isPlaceholderLikeText,
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
})
