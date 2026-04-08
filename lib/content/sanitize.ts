const PLACEHOLDER_MARKERS = ['待补充', '基础深读版本整理']
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
  return isCorruptedText(trimmed)
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
