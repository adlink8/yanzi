import type { Album, Song, SongDeepRead } from '@/types/content'

export function buildSongContext(song: Song, album: Album | undefined, deepRead: SongDeepRead | null): string {
  const lines = [
    `歌曲：${song.title}`,
    `专辑：${album?.title ?? '未知专辑'}`,
    `时期：${song.era}`,
    `情绪标签：${song.moodTags.join('、') || '无'}`,
    `主题标签：${song.themeTags.join('、') || '无'}`,
    `关键词：${song.keywords.join('、') || '无'}`,
    `摘要：${song.summary}`,
    `关联歌曲：${song.relatedSongs.join('、') || '无'}`
  ]

  if (deepRead?.content) {
    lines.push('整体解读：')
    lines.push(deepRead.content)
  }

  if (deepRead?.fullLyrics) {
    lines.push('完整歌词（用户录入）：')
    lines.push(deepRead.fullLyrics)
  } else if (deepRead?.lyricBlocks?.length) {
    lines.push('歌词分段（用户录入）：')
    for (const block of deepRead.lyricBlocks) {
      lines.push(block)
    }
  }

  if (deepRead?.lyricInterpretations?.length) {
    lines.push('逐段/逐句解读：')
    for (const item of deepRead.lyricInterpretations) {
      lines.push(`段落：${item.section}`)
      lines.push(`锚点：${item.reference}`)
      if (item.lyricText) {
        lines.push(`歌词：${item.lyricText}`)
      }
      lines.push(`解读：${item.interpretation}`)
      if (item.whyItMatters) {
        lines.push(`重要性：${item.whyItMatters}`)
      }
    }
  }

  if (deepRead?.songDesign) {
    lines.push('整首歌设计分析：')
    if (deepRead.songDesign.summary) {
      lines.push(`总述：${deepRead.songDesign.summary}`)
    }
    for (const item of deepRead.songDesign.structure) {
      lines.push(`结构：${item}`)
    }
    for (const item of deepRead.songDesign.emotionCurve) {
      lines.push(`情绪推进：${item}`)
    }
    for (const item of deepRead.songDesign.craftNotes) {
      lines.push(`写法观察：${item}`)
    }
  }

  if (deepRead?.mvUrl) {
    lines.push(`MV链接：${deepRead.mvUrl}`)
  }

  return lines.join('\n')
}

export function buildAlbumContext(album: Album, songs: Song[]): string {
  const lines = [
    `专辑：${album.title}`,
    `年份：${album.releaseYear}`,
    `时期：${album.era}`,
    `摘要：${album.summary}`,
    `核心主题：${album.coreThemes.join('、') || '无'}`,
    `代表歌：${album.representativeSongs.join('、') || '无'}`,
    `收录歌曲数：${songs.length}`
  ]

  return lines.join('\n')
}

export function buildSongPrompt(song: Song, album: Album | undefined, question: string) {
  const context = buildSongContext(song, album, null) 
  return [
    {
      role: 'system' as const,
      content: '你是一个孙燕姿作品深度解读专家。你熟悉她的每一张专辑、每一首歌背后的情感和创作背景。请基于提供的资料回答用户的问题。回答要感性与理性并重，保持专业且亲切的语气。'
    },
    {
      role: 'user' as const,
      content: `关于歌曲《${song.title}》的背景资料：\n${context}\n\n我的问题是：${question}`
    }
  ]
}

export function buildAlbumPrompt(album: Album, songs: Song[], question: string) {
  const context = buildAlbumContext(album, songs)
  return [
    {
      role: 'system' as const,
      content: '你是一个孙燕姿作品深度解读专家。你熟悉她的每一张专辑、每一首歌背后的情感和创作背景。请基于提供的资料回答用户的问题。回答要感性与理性并重，保持专业且亲切的语气。'
    },
    {
      role: 'user' as const,
      content: `关于专辑《${album.title}》的背景资料：\n${context}\n\n我的问题是：${question}`
    }
  ]
}