import type { Album, Song, SongDeepRead } from '@/types/content'

export function makeSong(overrides: Partial<Song> = {}): Song {
  return {
    slug: 'tian-hei-hei',
    title: '天黑黑',
    albumSlug: 'yanzi',
    releaseYear: 2000,
    era: '出道起点',
    trackNumber: 1,
    moodTags: ['成长', '想念'],
    themeTags: ['青春'],
    keywords: ['童年'],
    summary: '把长大后的失落和小时候的安全感并置。',
    favoriteLevel: 'high',
    hasDeepRead: true,
    relatedSongs: ['kai-shi-dong-le'],
    status: 'ready',
    ...overrides
  }
}

export function makeAlbum(overrides: Partial<Album> = {}): Album {
  return {
    slug: 'yanzi',
    title: '孙燕姿同名专辑',
    releaseYear: 2000,
    era: '出道起点',
    isOfficial: true,
    summary: '以清澈、直接又带民谣感的表达打开大众认知。',
    coreThemes: ['青春', '自我表达'],
    representativeSongs: ['天黑黑'],
    songSlugs: ['tian-hei-hei'],
    ...overrides
  }
}

export function makeDeepRead(overrides: Partial<SongDeepRead> = {}): SongDeepRead {
  return {
    content: '整体解读正文',
    mvUrl: 'https://example.com/mv',
    fullLyrics: '歌词第一行\n歌词第二行',
    lyricBlocks: [],
    lyricInterpretations: [
      {
        id: 'u1',
        section: '主歌',
        reference: '开头',
        lyricText: '我的童年',
        interpretation: '回忆入口',
        whyItMatters: '奠定情绪'
      }
    ],
    songDesign: {
      summary: '结构清晰',
      structure: ['主歌-副歌'],
      emotionCurve: ['从安静到释放'],
      craftNotes: ['口语化叙事']
    },
    ...overrides
  }
}
