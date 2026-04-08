# Stefanie Sun Deep Reads

缂備礁顦悞锕€锕㈡笟鈧幊娑㈩敂閸℃ɑ娈㈤梺姹囧妼鐎氼剟鎮洪埡鍛亞闁哄洨鍊鐔稿婵犲﹤鍟幆鍌涚箾閿濆懎鑸归悗鐟扮－閹叉挳鏁愰崼顐㈡缂備焦姊归悷锔捐姳椤曗偓閹秵鎷呮搴㈠皾闁圭厧鐡ㄩ幐鍫曞焵?
## Source Paths

- Linux: `/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`
- Windows: `\\wsl.localhost\Ubuntu-D\home\li\projects\repos\products\fandom\stefanie-sun-deep-reads`

## Project Status

- Mode: private-self-use
- Stack: Next.js + TypeScript + Tailwind CSS
- Content: JSON metadata + Markdown deep reads + local raw lyrics files
- Default AI: Ollama (`gemma4:e4b`)

- docs/UNINDEXED-SONGS.md\r\n
## Content Progression Order

闂佸搫鐗滈崜鐔煎Υ瀹ュ鍎庢い鏂垮悑閸婄數绱撴笟鍥у箹闁哥偛顕埀顒€婀遍幊鎾剁磽閹捐埖濯奸柛鎾楀懎鐓氭繛鎴炴尨閸嬫捇鏌熺粙娆炬Ъ缂佺粯鐗犲鍫曞灳閹绘帞妲ｇ紓浣哄亾鐎笛呮暜鐟欏嫭浜ゆ繛鎴濈－缁?
1. 闂佸搫鍟悥鐓幬涚捄銊ф／?2. 婵炴垶鎸婚幑浣烘?3. 濠殿喗绻傞張顒€煤?
婵炴垶姊婚崰搴☆潩閵娾晛鍙婃い鏍ㄧ箥閸ゆ盯鏌?
- 闂佺绻愰悧鍡楋耿椤忓牆绫嶉柛顐ｆ礃閿涚喓绱掗幆褋浠掔紒妤€鍊诲☉鐢割敊濞嗘儳鎮嬮梺鍝勫暢閸╂牕锕㈤埄鍐枖閹兼番鍔嶉埢澶嬬箾?- 闂佸憡鍔曠粔椋庢崲濮椻偓瀹曟濡烽妷顔兼闁圭厧鐡ㄩ弻褏绮幘瀛樼秶?- 闂佸搫鐗冮崑鎾绘煕濮橆剟鍙勯柍褜鍓氶崝娆撱€呯拠宸桨鐎光偓閸忣垰顦伴‖鍥箛椤掑倹娈梺杞扮閻°劑鎮洪弴鐘冲珰鐎广儱鍟犻崑鎾寸瑹閳ь剟鍩€椤掍礁濮囩憸鎵仧閹叉挳鏁愰崼顐㈡婵炴垶鎸哥€涒晠寮抽敐鍡磾闁哄秲鍔庨幗鍐偣娴ｇ懓绀冩い鎾存倐瀹曟岸宕卞Ο灏栧亾?
閻熸粎澧楅幐鍛婃櫠閻樼數绠旀い鎴ｆ硶椤忛亶寮堕悜鍡楁灍闁绘鐤囩粻娑㈠礃椤旇　鍋撴惔銏″劅闊洤姘︾粈瀣煥?
- `2000` - `yanzi`
- `2002` - `start`
- `2003` - `the-moment`

## Song Content Layout

### Directory Rules

Song-related content is stored under:

- `content/songs/index.json`
- `content/songs/deep-reads/`
- `content/songs/raw-lyrics/`

### File Responsibilities

- `content/songs/index.json`
  - Stores lightweight metadata for list pages, tags, navigation, and recommendation logic
- `content/songs/deep-reads/{slug}.md`
  - Stores MV links, overall interpretation, lyric-level interpretation, and song design analysis
- `content/songs/raw-lyrics/{slug}.txt`
  - Stores the full lyrics text that you manually maintain for private use
  - The app automatically loads this file first when displaying complete lyrics

### Naming Rule

Use kebab-case pinyin slugs consistently across all related files.

Examples:

- `tian-hei-hei`
- `wo-huai-nian-de`
- `yu-jian`
- `kai-shi-dong-le`

That means one song may map to:

- `content/songs/deep-reads/tian-hei-hei.md`
- `content/songs/raw-lyrics/tian-hei-hei.txt`

## Lyrics Storage Format

### Preferred Full Lyrics File

Store full lyrics in a plain text file:

- `content/songs/raw-lyrics/{slug}.txt`

Recommended format:

```txt
缂備焦顨忛崗娑氱博鐎靛憡鍋橀悘鐐插⒔閹藉啴鎮?缂備焦顨忛崗娑氳姳閳哄啯鍋橀悘鐐插⒔閹藉啴鎮?
缂備焦顨忛崗娑氱箔娴ｇ儤鍋橀悘鐐插⒔閹藉啴鎮?缂備焦顨忛崜娆徝洪幘鑸靛仒閻忕偛澧介幗鍐偣?```

Requirements:

- Keep original line breaks
- Leave a blank line between sections if needed
- Do not mix commentary into the raw lyrics file
- This file should contain lyrics text only
- The app will use this file before any `fullLyrics` field in markdown

### Deep Read File

Store analysis in:

- `content/songs/deep-reads/{slug}.md`

This file should contain:

- `mvTitle`
- `mvUrl`
- optional `fullLyrics`
- `lyricBlocks`
- `lyricInterpretations`
- `songDesign`
- the overall interpretation in the markdown body

A template is provided at:

- `content/songs/deep-reads/_template.md`

## Recommended Workflow

For a new song:

1. Add or confirm metadata in `content/songs/index.json`
2. Put full lyrics into `content/songs/raw-lyrics/{slug}.txt`
3. Create or update `content/songs/deep-reads/{slug}.md`
4. Fill in:
   - overall interpretation
   - lyric-by-lyric or section-by-section interpretation
   - song design analysis
   - MV link

## Next Step

Make sure Ollama is running in WSL, then run `npm run dev`.