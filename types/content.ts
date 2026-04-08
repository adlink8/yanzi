export type Song = {
  slug: string
  title: string
  albumSlug: string
  releaseYear?: number
  era: string
  trackNumber?: number
  moodTags: string[]
  themeTags: string[]
  keywords: string[]
  summary: string
  personalRating?: number
  favoriteLevel?: 'low' | 'medium' | 'high'
  hasDeepRead: boolean
  relatedSongs: string[]
  status: 'draft' | 'ready'
}

export type Album = {
  slug: string
  title: string
  releaseYear: number
  era: string
  summary: string
  coreThemes: string[]
  representativeSongs: string[]
  songSlugs: string[]
}

export type Tag = {
  slug: string
  name: string
  type: 'mood' | 'theme'
  description: string
}

export type TimelineEvent = {
  id: string
  date: string
  title: string
  type: 'album' | 'song' | 'concert' | 'milestone'
  description: string
  relatedAlbumSlug?: string
  relatedSongSlug?: string
}

export type SongInterpretationUnit = {
  id: string
  section: string
  reference: string
  lyricText?: string
  interpretation: string
  whyItMatters?: string
}

export type SongDesignAnalysis = {
  summary?: string
  structure: string[]
  emotionCurve: string[]
  craftNotes: string[]
}

export type SongDeepRead = {
  content: string
  mvUrl?: string
  mvTitle?: string
  fullLyrics?: string
  lyricBlocks: string[]
  lyricInterpretations: SongInterpretationUnit[]
  songDesign?: SongDesignAnalysis
}