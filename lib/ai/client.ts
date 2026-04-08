import { getAiConfig } from '@/lib/ai/config'

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
  error?: {
    message?: string
  }
}

export async function createChatCompletion(messages: ChatMessage[]): Promise<string> {
  const config = getAiConfig()

  if (!config.enabled) {
    throw new Error('AI_NOT_CONFIGURED')
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.5,
      messages
    }),
    cache: 'no-store'
  })

  const data = (await response.json()) as ChatCompletionResponse

  if (!response.ok) {
    throw new Error(data.error?.message || 'AI_REQUEST_FAILED')
  }

  const content = data.choices?.[0]?.message?.content?.trim()

  if (!content) {
    throw new Error('AI_EMPTY_RESPONSE')
  }

  return content
}