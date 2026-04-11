import fs from 'node:fs/promises'

export function safeArray(value) {
  return Array.isArray(value) ? value : []
}

export function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export function toSlugList(items) {
  return safeArray(items)
    .map((item) => normalizeText(item?.slug))
    .filter((slug) => slug.length > 0)
}

export function mdList(items) {
  if (!items || items.length === 0) {
    return '- none'
  }
  return items.map((item) => `- ${item}`).join('\n')
}

export function duplicateValues(values) {
  const counts = new Map()
  for (const value of values) {
    counts.set(value, (counts.get(value) || 0) + 1)
  }

  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value, count]) => ({ value, count }))
}

export function summarizeIssueCounts(issues) {
  return Object.fromEntries(
    Object.entries(issues).map(([key, value]) => [key, Array.isArray(value) ? value.length : 0])
  )
}

export async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

export function normalizeHttpUrl(input) {
  if (typeof input !== 'string' || !input.trim()) {
    return null
  }

  try {
    const parsed = new URL(input.trim())
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function isArchiveLikeSlug(slug) {
  const value = normalizeText(slug)
  return value.startsWith('archive-') || value.endsWith('-archive') || value.includes('-archive-')
}

export function uniqueValues(values) {
  return [...new Set(values)]
}
