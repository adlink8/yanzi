---
phase: 05-deep-read-quality
plan: 02
completed: 2026-07-17
---

# Phase 5 Plan 02 Summary

## Result

- Lyrics loader drops placeholder raw-lyrics / frontmatter (`resolveRealFullLyrics`)
- Song page only shows real full lyrics; muted「歌词待补录」when pending
- `shang-bu-liao`: no invented lyrics; fake interpretation stubs removed; ISSUES-LOG updated
- `tests/content/lyrics-fallback.test.ts` + sanitize tests

## Acceptance

- [x] Placeholder raw-lyrics never display as full lyrics
- [x] shang-bu-liao fake line-by-line units removed/filtered
- [x] Tests pass
- [x] ISSUES-LOG updated (real lyrics still open)
