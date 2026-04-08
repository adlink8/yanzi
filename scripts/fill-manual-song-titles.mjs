import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const songsPath = path.join(root, 'content', 'songs', 'index.json')

const manualTitleMap = {
  'honey-honey': 'Honey Honey',
  '180-du': '180度',
  'ai-cong-ling-kai-shi': '爱从零开始',
  'ai-qing-zheng-shu-start-concert': '爱情证书（Start演唱会）',
  'ai-qing-zi-dian-start-concert': '爱情字典（Start演唱会）',
  'bu-neng-he-ni-yi-qi': '不能和你一起',
  'bu-shi-zhen-de-ai-wo': '不是真的爱我',
  'bu-tong': '不同',
  'chao-kuai-gan-start-concert': '超快感（Start演唱会）',
  'chao-ren-lei': '超人类',
  'dang-dong-ye-jian-nuan': '当冬夜渐暖',
  'dong-shi': '懂事',
  'fan-guo-lai-zou-zou': '反过来走走',
  'feng-zheng-start-concert': '风筝（Start演唱会）',
  'guan-yu': '关于',
  'hai-pa-start-concert': '害怕（Start演唱会）',
  'he-ping': '和平',
  'hen-hao-start-concert': '很好（Start演唱会）',
  'jiu-shi-zhe-yang': '就是这样',
  ke: '渴',
  'lan-de-qu-guan': '懒得去管',
  'lei-zhui': '泪坠',
  'lets-vino': "Let's Vino",
  'lian-xi': '练习',
  'ling-que-dian-start-concert': '零缺点（Start演唱会）',
  'liu-lang-di-tu': '流浪地图',
  'lu-guang-start-concert': '绿光（Start演唱会）',
  'mei-shi-jian': '没时间',
  'meng-bu-luo': '梦不落',
  'meng-xiang-tian-kong': '梦想天空',
  'ming-tian-de-ji-yi': '明天的记忆',
  'ming-tian-qing-tian': '明天晴天',
  'nan-de-yi-jian-start-concert': '难得一见（Start演唱会）',
  'ni-hao-bu-hao': '你好不好',
  'ni-ming-wan-sui': '匿名万岁',
  'nian-qing-wu-xian': '年轻无限',
  'nong-mei-mao': '浓眉毛',
  'ping-ri-kuai-le': '平日快乐',
  'qin-guang': '擒光',
  'quan-xin-quan-yi': '全心全意',
  'ren-zhi': '人质',
  'shi-guang-xiao-tou': '时光小偷',
  stefanie: 'Stefanie',
  'sui-tang-ce-yan-start-concert': '随堂测验（Start演唱会）',
  'ta-men-de-ge': '他们的歌',
  'tai-yang-di-xia': '太阳底下',
  'the-moment': 'The Moment',
  'tian-kong': '天空',
  'tian-yue-liang-ye-yue-hei': '天越亮，夜越黑',
  'tian-yue-liang-ye-yue-hei-2': '天越亮，夜越黑（版本二）',
  'ting-jian': '听见',
  'tong-yao-1987': '童谣1987',
  'wei-rao': '围绕',
  'wei-wan-cheng': '未完成',
  'wei-zhi-de-jing-cai-2': '未知的精采（版本二）',
  'wen-rou-mayday-blue-20th': '温柔（五月天 BLUE 20th）',
  'wo-bu-ai': '我不爱',
  'wo-hen-wo-ai-ni': '我恨我爱你',
  'wo-shi-wo': '我是我',
  'wo-wei-shen-me-na-me-ai-ni': '我为什么那么爱你',
  'wo-xiang': '我想',
  'wo-yao-de-xing-fu-start-concert': '我要的幸福（Start演唱会）',
  'wo-yao-kuai-le': '我要快乐',
  'wu-xian-da': '无限大',
  'xing-qi-yi-tian-qi-qing-wo-li-kai-ni': '星期一天气晴我离开你',
  'xu-yao-ni': '需要你',
  'xuan-wo': '漩涡',
  'xue-hui': '学会',
  'yan-shen': '眼神',
  'yang-zi': '样子',
  'yi-qi-zou-dao': '一起走到',
  'yi-yang-de-xia-tian': '一样的夏天',
  'yong-gan': '勇敢',
  'yong-yuan': '永远',
  'zai-ye-bu-jian': '再也不见',
  'zhen-de-start-concert': '真的（Start演唱会）',
  'zhong-jian-di-dai': '中间地带',
  'zhong-yu': '终于',
  'zhong-yu-2': '终于（版本二）',
  zhui: '追',
  'zuo-zhan': '作战'
}

const songs = JSON.parse(await fs.readFile(songsPath, 'utf8'))

let updated = 0
for (const song of songs) {
  if (song.title !== '标题待补') continue
  const mapped = manualTitleMap[song.slug]
  if (!mapped) continue
  song.title = mapped
  updated += 1
}

await fs.writeFile(songsPath, `${JSON.stringify(songs, null, 2)}\n`, 'utf8')

console.log(JSON.stringify({ updated, totalSongs: songs.length }, null, 2))
