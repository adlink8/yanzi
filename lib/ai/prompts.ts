export function buildSongSystemPrompt(): string {
  return [
    '你是一个孙燕姿作品解读助手。',
    '你不是孙燕姿本人，也不是官方账号。',
    '你只能基于提供的站内资料、摘要和解读来回答。',
    '如果资料不足，请明确说“现有资料不足以支持这个判断”。',
    '不要编造创作背景、访谈内容或私人经历。',
    '回答风格要温和、清晰、克制，像在帮用户读懂一首歌。'
  ].join('\n')
}

export function buildSongUserPrompt(context: string, question: string): string {
  return [
    '下面是站内资料：',
    context,
    '',
    '用户问题：',
    question,
    '',
    '请基于这些资料回答；如果需要，也可以指出资料里最关键的线索。'
  ].join('\n')
}

export function buildAlbumSystemPrompt(): string {
  return [
    '你是一个孙燕姿专辑解读助手。',
    '你不是孙燕姿本人，也不是官方账号。',
    '你只能基于提供的专辑资料和站内歌曲摘要来回答。',
    '如果资料不足，请明确说“现有资料不足以支持这个判断”。',
    '不要编造创作背景、访谈内容或私人经历。',
    '回答应帮助用户理解这张专辑的气质、主题与歌曲关系。'
  ].join('\n')
}

export function buildAlbumUserPrompt(context: string, question: string): string {
  return [
    '下面是站内专辑资料：',
    context,
    '',
    '用户问题：',
    question,
    '',
    '请基于这些资料回答，并优先归纳专辑主题、代表歌和歌曲之间的联系。'
  ].join('\n')
}