import { afterEach, describe, expect, it } from 'vitest'
import { getAiConfig } from '@/lib/ai/config'

const ORIGINAL = {
  baseUrl: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL
}

afterEach(() => {
  if (ORIGINAL.baseUrl === undefined) delete process.env.OPENAI_BASE_URL
  else process.env.OPENAI_BASE_URL = ORIGINAL.baseUrl

  if (ORIGINAL.apiKey === undefined) delete process.env.OPENAI_API_KEY
  else process.env.OPENAI_API_KEY = ORIGINAL.apiKey

  if (ORIGINAL.model === undefined) delete process.env.OPENAI_MODEL
  else process.env.OPENAI_MODEL = ORIGINAL.model
})

describe('getAiConfig', () => {
  it('uses cloud defaults and stays disabled without API key', () => {
    delete process.env.OPENAI_BASE_URL
    delete process.env.OPENAI_API_KEY
    delete process.env.OPENAI_MODEL

    const config = getAiConfig()
    expect(config.baseUrl).toBe('https://api.openai.com/v1')
    expect(config.model).toBe('gpt-4o-mini')
    expect(config.enabled).toBe(false)
    expect(config.provider).toBe('openai')
  })

  it('enables when API key is present and trims trailing slash', () => {
    process.env.OPENAI_BASE_URL = 'https://api.deepseek.com/v1/'
    process.env.OPENAI_API_KEY = 'sk-test'
    process.env.OPENAI_MODEL = 'deepseek-chat'

    const config = getAiConfig()
    expect(config.enabled).toBe(true)
    expect(config.baseUrl).toBe('https://api.deepseek.com/v1')
    expect(config.provider).toBe('custom')
    expect(config.model).toBe('deepseek-chat')
  })

  it('labels localhost endpoints as ollama', () => {
    process.env.OPENAI_BASE_URL = 'http://127.0.0.1:11434/v1'
    process.env.OPENAI_API_KEY = 'ollama'
    const config = getAiConfig()
    expect(config.provider).toBe('ollama')
  })
})
