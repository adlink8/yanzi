export type AiConfig = {
  baseUrl: string
  apiKey: string
  model: string
  enabled: boolean
  provider: 'openai' | 'ollama' | 'custom'
}

const DEFAULT_BASE_URL = 'https://api.openai.com/v1'
const DEFAULT_MODEL = 'gpt-4o-mini'

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

export function getAiConfig(): AiConfig {
  const baseUrl = process.env.OPENAI_BASE_URL?.trim() || DEFAULT_BASE_URL
  const apiKey = process.env.OPENAI_API_KEY?.trim() || ''
  const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL

  const isOllama = baseUrl.includes('127.0.0.1') || baseUrl.includes('localhost')

  return {
    baseUrl: trimTrailingSlash(baseUrl),
    apiKey,
    model,
    enabled: Boolean(apiKey), // Only enabled if API key is provided
    provider: isOllama ? 'ollama' : (baseUrl === DEFAULT_BASE_URL ? 'openai' : 'custom')
  }
}