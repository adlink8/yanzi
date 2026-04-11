export const CONTENT_AUDIT_RULES = {
  genericPhrases: [
    '正在整理中',
    '这首歌通过',
    '歌曲通过',
    '表达了',
    '情感层次',
    '值得我们',
    '具有很强的共鸣'
  ],
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
    '在这里我们可以看到'
  ],
  minTokens: 220,
  minUniqueRatio: 0.58,
  minParagraphs: 3,
  candidateMinScore: 3
}

export const MV_REMEDIATION_RULES = {
  homepageHosts: ['www.bilibili.com', 'bilibili.com'],
  rootPathnames: ['/', '']
}
