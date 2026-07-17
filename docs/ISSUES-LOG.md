# Issues Log

## Current Recorded Issues

### 1. Visible `????` / garbled Chinese in page UI

- Scope:
  - home page
  - songs page
  - albums page
  - timeline page
  - AI panels
  - recommendation panels
- Root cause:
  - Some visible UI files were written with broken encoding during previous edits
- Status:
  - fixed
- Files involved:
  - `app/page.tsx`
  - `app/songs/page.tsx`
  - `app/albums/page.tsx`
  - `app/timeline/page.tsx`
  - `components/common/home-companion.tsx`
  - `components/common/mood-recommender.tsx`
  - `components/song/song-ai-panel.tsx`
  - `components/album/album-ai-panel.tsx`

### 2. Garbled indexed song metadata

- Scope:
  - indexed song cards
  - top card area above overall interpretation
  - keyword / mood / theme tag area
- Root cause:
  - `content/songs/index.json` had multiple fields polluted by question-mark / broken-encoding text
- Affected fields:
  - `title`
  - `summary`
  - `era`
  - `keywords`
  - `moodTags`
  - `themeTags`
- Status:
  - fixed
- Validation result:
  - `BAD_SONG_METADATA = 0`

### 3. Garbled indexed album metadata

- Scope:
  - album list page
  - album detail page summaries and representative song display
- Root cause:
  - `content/albums/index.json` had corrupted Chinese metadata in some later-added entries
- Affected fields:
  - `title`
  - `summary`
  - `era`
  - `representativeSongs`
  - `coreThemes`
- Status:
  - fixed

### 4. Placeholder scaffolds visible in indexed content

- Root cause:
  - auto-generated deep-read scaffolds originally contained placeholder text such as `待补充`
- Status:
  - fixed for indexed songs
- Validation result:
  - visible indexed placeholders: `0`

### 5. Placeholder lyrics for `shang-bu-liao`

- Song:
  - `shang-bu-liao`
- File:
  - `content/songs/raw-lyrics/shang-bu-liao.txt` exists but body is still a `[待补录]` placeholder
- Impact:
  - song page can load a file, but users do not see real lyrics
- Status:
  - open（Phase 5 / META-03）

## Technical Root Cause Summary

The main source of the visible `????` issue was not the deep-read body content itself.
The main sources were:

- broken UTF-8 handling during previous file rewrites
- polluted JSON metadata used directly by the UI card layer
- broken hardcoded Chinese UI labels in page / component source files

## Current Validation Snapshot

- indexed song metadata corruption: `0`
- visible indexed placeholders: `0`
- albumSlug orphans: `0`（2026-07-17 closeout）
- songSlugs drift: `0`（derived from song `albumSlug`）
- build status: passing (last verified via project ops notes)

## Follow-up Rule

Before continuing large-scale indexing or content expansion:

1. keep visible UI text UTF-8 clean
2. keep indexed metadata clean
3. run build validation after each batch
4. record unresolved issues here first