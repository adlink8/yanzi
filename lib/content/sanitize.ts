/** Scaffold / placeholder phrases that must not surface as real copy. */
export const PLACEHOLDER_MARKERS = [
  '待补充',
  '待补录',
  '待补全',
  '基础深读版本整理',
  '基础深读',
  '自动补充的第',
  '情绪结构样本',
  '语句 5',
  '歌词分段待补',
  '歌词待补',
  '补录要求',
  '这一段的关键词是',
  '往更明确的情绪方向推进',
  '它的重要性在于把听感从',
  '整体解读正在整理中',
  '整体解读待补充'
]

/** Short lyricText stubs from scaffold deep-reads — exact match only. */
const SCAFFOLD_LYRIC_TEXT_STUBS = new Set([
  '开场句',
  '中段句',
  '转折句',
  '结尾句'
])

const CJK_PATTERN = /[\u3400-\u9FFF]/

function questionMarkCount(value: string): number {
  const matches = value.match(/\?/g)
  return matches ? matches.length : 0
}

export function humanizeSlug(slug: string): string {
  const trimmed = slug.trim()
  if (!trimmed) {
    return '未命名条目'
  }

  const words = trimmed
    .split('-')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      if (/^\d+$/.test(part)) return part
      return `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`
    })

  return words.length > 0 ? words.join(' ') : '未命名条目'
}

export function isCorruptedText(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return false
  if (trimmed.includes('�')) return true
  if (/\?{2,}/.test(trimmed)) return true

  const qCount = questionMarkCount(trimmed)
  if (qCount === 0) return false

  const compactLength = trimmed.replace(/\s+/g, '').length
  if (compactLength === 0) return true

  if (qCount / compactLength >= 0.12) return true
  if (!CJK_PATTERN.test(trimmed)) return true

  return false
}

export function isPlaceholderLikeText(value: string | undefined | null): boolean {
  if (!value) return true
  const trimmed = value.trim()
  if (!trimmed) return true
  if (PLACEHOLDER_MARKERS.some((marker) => trimmed.includes(marker))) return true
  if (SCAFFOLD_LYRIC_TEXT_STUBS.has(trimmed)) return true
  if (/语句\s*\d+/.test(trimmed)) return true
  return isCorruptedText(trimmed)
}

/**
 * Whole-document lyrics that are meta placeholders (not real song lyrics).
 * Used so files like `[待补录] …` never surface as fullLyrics.
 */
export function isLyricsPlaceholderDocument(value: string | undefined | null): boolean {
  if (!value) return true
  const trimmed = value.trim()
  if (!trimmed) return true
  if (isPlaceholderLikeText(trimmed)) return true
  // Meta instruction blocks that may survive line-level filter weakly
  if (/\[待补录\]/.test(trimmed)) return true
  return false
}

/** Resolve real full lyrics text, or undefined when missing / placeholder. */
export function resolveRealFullLyrics(
  rawLyrics: string | null | undefined,
  frontmatterLyrics: string | null | undefined
): string | undefined {
  const preferRaw = asRealFullLyrics(rawLyrics)
  if (preferRaw) return preferRaw
  return asRealFullLyrics(frontmatterLyrics)
}

function asRealFullLyrics(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  if (isLyricsPlaceholderDocument(value)) return undefined
  const cleaned = sanitizeMultilineText(value)
  if (!cleaned) return undefined
  if (isLyricsPlaceholderDocument(cleaned)) return undefined
  return cleaned
}

export function isScaffoldLyricText(value: string | undefined | null): boolean {
  if (!value) return false
  const trimmed = value.trim()
  if (!trimmed) return false
  if (SCAFFOLD_LYRIC_TEXT_STUBS.has(trimmed)) return true
  // e.g. 《上不了》 语句 5
  if (/语句\s*\d+/.test(trimmed)) return true
  if (isPlaceholderLikeText(trimmed)) return true
  return false
}

export function isScaffoldInterpretationUnit(unit: {
  section: string
  reference: string
  lyricText?: string
  interpretation: string
}): boolean {
  if (isPlaceholderLikeText(unit.interpretation)) return true
  if (unit.section.includes('自动补充')) return true
  if (isScaffoldLyricText(unit.lyricText)) return true
  // Template auto-fill references: 《title》 第 N 段
  if (/第\s*\d+\s*段/.test(unit.reference) && unit.reference.includes('《')) return true
  return false
}

export function sanitizeText(value: string | undefined | null, fallback = ''): string {
  if (!value) return fallback
  const trimmed = value.trim()
  if (!trimmed) return fallback
  if (isPlaceholderLikeText(trimmed)) return fallback
  return trimmed
}

export function sanitizeTextArray(values: string[] | undefined | null): string[] {
  if (!values || values.length === 0) return []
  return values
    .map((value) => sanitizeText(value, ''))
    .filter((value) => value.length > 0)
}

export function sanitizeMultilineText(value: string | undefined | null): string {
  if (!value) return ''

  const lines = value.split(/\r?\n/g)
  const sanitizedLines = lines.filter((line) => {
    const trimmed = line.trim()
    if (!trimmed) return true
    return !isPlaceholderLikeText(trimmed)
  })

  return sanitizedLines.join('\n').trim()
}
