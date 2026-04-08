export type AiConfig = {
  baseUrl: string
  apiKey: string
  model: string
  enabled: boolean
  provider: 'ollama' | 'custom'
}

const DEFAULT_OLLAMA_BASE_URL = 'http://127.0.0.1:11434/v1'
const DEFAULT_OLLAMA_API_KEY = 'ollama'
const DEFAULT_OLLAMA_MODEL = 'gemma4:e4b'

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

export function getAiConfig(): AiConfig {
  const baseUrl = process.env.OPENAI_BASE_URL?.trim() || DEFAULT_OLLAMA_BASE_URL
  const apiKey = process.env.OPENAI_API_KEY?.trim() || DEFAULT_OLLAMA_API_KEY
  const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_OLLAMA_MODEL

  const usingDefaultOllama =
    baseUrl === DEFAULT_OLLAMA_BASE_URL &&
    apiKey === DEFAULT_OLLAMA_API_KEY &&
    model === DEFAULT_OLLAMA_MODEL

  return {
    baseUrl: trimTrailingSlash(baseUrl),
    apiKey,
    model,
    enabled: Boolean(baseUrl && apiKey && model),
    provider: usingDefaultOllama ? 'ollama' : 'custom'
  }
}