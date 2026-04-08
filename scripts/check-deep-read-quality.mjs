import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const root = process.cwd()
const deepReadDir = path.join(root, 'content', 'songs', 'deep-reads')

const todoSlugs = [
  '180-du',
  'ai-cong-ling-kai-shi',
  'ai-qing-zheng-shu-start-concert',
  'ai-qing-zi-dian-start-concert',
  'bu-neng-he-ni-yi-qi',
  'bu-shi-zhen-de-ai-wo',
  'bu-tong',
  'chao-kuai-gan-start-concert',
  'chao-ren-lei',
  'dang-dong-ye-jian-nuan',
  'dong-shi',
  'dream-a-little-dream-of-me',
  'e-lover-2',
  'fan-guo-lai-zou-zou',
  'feng-zheng-start-concert',
  'guan-yu',
  'hai-pa-start-concert',
  'he-ping',
  'hen-hao-start-concert',
  'hey-jude-start-concert',
  'hey-jude',
  'jiu-shi-zhe-yang',
  'ke',
  'lan-de-qu-guan',
  'leave-me-alone-start-concert',
  'lei-zhui',
  'lets-vino',
  'lian-xi',
  'ling-que-dian-start-concert',
  'liu-lang-di-tu',
  'lu-guang-start-concert',
  'mei-shi-jian',
  'meng-bu-luo',
  'meng-xiang-tian-kong',
  'ming-tian-de-ji-yi',
  'ming-tian-qing-tian',
  'my-story-your-song',
  'nan-de-yi-jian-start-concert',
  'ni-hao-bu-hao',
  'ni-ming-wan-sui',
  'nian-qing-wu-xian',
  'nong-mei-mao',
  'on-the-road',
  'one-united-people',
  'opening',
  'ping-ri-kuai-le',
  'qin-guang',
  'quan-xin-quan-yi',
  'radio',
  'ren-zhi',
  'rise',
  'shi-guang-xiao-tou',
  'silent-all-these-years',
  'someone-start-concert',
  'someone',
  'sometimes-love-just-aint-enough',
  'sparking-diamonds',
  'sparkling-diamonds-start-concert',
  'stefanie',
  'sui-tang-ce-yan-start-concert',
  'sweet-child-o-mine-2',
  'sweet-child-o-mine',
  'ta-men-de-ge',
  'tai-yang-di-xia',
  'that-i-would-be-good',
  'the-moment',
  'tian-kong',
  'tian-yue-liang-ye-yue-hei-2',
  'tian-yue-liang-ye-yue-hei',
  'ting-jian',
  'tong-yao-1987',
  'up2u',
  'venus-start-concert',
  'venus',
  'we-will-get-there',
  'wei-rao',
  'wei-wan-cheng',
  'wei-zhi-de-jing-cai-2',
  'wen-rou-mayday-blue-20th',
  'wo-bu-ai',
  'wo-hen-wo-ai-ni',
  'wo-shi-wo',
  'wo-wei-shen-me-na-me-ai-ni',
  'wo-xiang',
  'wo-yao-de-xing-fu-start-concert',
  'wo-yao-kuai-le',
  'wu-xian-da',
  'xing-qi-yi-tian-qi-qing-wo-li-kai-ni',
  'xu-yao-ni',
  'xuan-wo',
  'xue-hui',
  'yan-shen',
  'yang-zi',
  'yi-qi-zou-dao',
  'yi-yang-de-xia-tian',
  'yong-gan',
  'yong-yuan',
  'zai-ye-bu-jian',
  'zhen-de-start-concert',
  'zhong-jian-di-dai',
  'zhong-yu-2',
  'zhong-yu',
  'zhui',
  'zuo-zhan'
]

const failures = []

for (const slug of todoSlugs) {
  const fullPath = path.join(deepReadDir, `${slug}.md`)
  const raw = await fs.readFile(fullPath, 'utf8')
  const parsed = matter(raw)
  const body = (parsed.content || '').trim()
  const paragraphs = body.split(/\n\s*\n/g).map((p) => p.trim()).filter(Boolean)
  const lyricInterpretations = Array.isArray(parsed.data.lyricInterpretations) ? parsed.data.lyricInterpretations : []
  const songDesign = parsed.data.songDesign && typeof parsed.data.songDesign === 'object' ? parsed.data.songDesign : {}
  const structure = Array.isArray(songDesign.structure) ? songDesign.structure : []
  const emotionCurve = Array.isArray(songDesign.emotionCurve) ? songDesign.emotionCurve : []
  const craftNotes = Array.isArray(songDesign.craftNotes) ? songDesign.craftNotes : []

  if (body.includes('整体解读正在整理中')) {
    failures.push({ slug, reason: 'body_placeholder' })
  }
  if (paragraphs.length < 2) {
    failures.push({ slug, reason: 'body_paragraphs_lt_2' })
  }
  if (lyricInterpretations.length < 4) {
    failures.push({ slug, reason: 'lyric_interpretations_lt_4' })
  }
  if (!songDesign.summary || String(songDesign.summary).trim().length < 20) {
    failures.push({ slug, reason: 'song_design_summary_weak' })
  }
  if (structure.length < 3) {
    failures.push({ slug, reason: 'song_design_structure_lt_3' })
  }
  if (emotionCurve.length < 3) {
    failures.push({ slug, reason: 'song_design_emotion_curve_lt_3' })
  }
  if (craftNotes.length < 3) {
    failures.push({ slug, reason: 'song_design_craft_notes_lt_3' })
  }
}

console.log(
  JSON.stringify(
    {
      totalChecked: todoSlugs.length,
      failureCount: failures.length,
      failures
    },
    null,
    2
  )
)
