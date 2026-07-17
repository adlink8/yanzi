/** Shared scaffold/placeholder markers (keep aligned with lib/content/sanitize.ts). */
export const SCAFFOLD_MARKERS = [
  '待补充',
  '待补录',
  '待补全',
  '基础深读版本整理',
  '基础深读',
  '自动补充的第',
  '情绪结构样本',
  '语句 5',
  '开场句',
  '歌词分段待补',
  '歌词待补',
  '补录要求',
  '这一段的关键词是',
  '往更明确的情绪方向推进',
  '它的重要性在于把听感从',
  '整体解读正在整理中',
  '整体解读待补充'
]

export const CONTENT_AUDIT_RULES = {
  genericPhrases: [
    '正在整理中',
    '这首歌通过',
    '歌曲通过',
    '表达了',
    '情感层次',
    '值得我们',
    '具有很强的共鸣',
    ...SCAFFOLD_MARKERS
  ],
  scaffoldMarkers: SCAFFOLD_MARKERS,
  trustedVideoHosts: [
    'www.youtube.com',
    'youtube.com',
    'youtu.be',
    'www.bilibili.com',
    'bilibili.com',
    'y.qq.com',
    'music.163.com',
    'www.iqiyi.com',
    'v.qq.com'
  ],
  deepReadMinChars: 180,
  lyricInterpretationsMin: 4,
  songDesignSummaryMinChars: 40,
  suspiciousMvKeywords: ['search', 'artist', 'playlist']
}

export const STYLE_AUDIT_RULES = {
  genericPhrases: [
    '这首歌通过',
    '歌曲通过',
    '表达了',
    '情感层次',
    '值得我们',
    '具有很强的共鸣',
    '让人感受到',
    '在这里我们可以看到',
    ...SCAFFOLD_MARKERS
  ],
  scaffoldMarkers: SCAFFOLD_MARKERS,
  minTokens: 220,
  minUniqueRatio: 0.58,
  minParagraphs: 3,
  candidateMinScore: 3
}

export const MV_REMEDIATION_RULES = {
  homepageHosts: ['www.bilibili.com', 'bilibili.com'],
  rootPathnames: ['/', '']
}
