import { describe, expect, it } from 'vitest'
import {
  getAlbumStatic,
  getAlbumsStatic,
  getSongStatic,
  getSongsByAlbumStatic,
  getSongsStatic
} from '@/lib/content/static-client'

describe('static-client (bundled catalog)', () => {
  it('loads songs and albums from bundled JSON', async () => {
    const songs = await getSongsStatic()
    const albums = await getAlbumsStatic()
    expect(songs.length).toBeGreaterThan(100)
    expect(albums.length).toBeGreaterThan(10)
  })

  it('looks up song/album by slug', async () => {
    const song = await getSongStatic('tian-hei-hei')
    expect(song?.title).toBeTruthy()
    expect(song?.albumSlug).toBeTruthy()

    const album = await getAlbumStatic(song!.albumSlug)
    expect(album?.slug).toBe(song!.albumSlug)
  })

  it('filters songs by albumSlug', async () => {
    const byAlbum = await getSongsByAlbumStatic('yanzi')
    expect(byAlbum.length).toBeGreaterThan(0)
    expect(byAlbum.every((song) => song.albumSlug === 'yanzi')).toBe(true)
  })

  it('returns undefined for unknown slug', async () => {
    expect(await getSongStatic('__no-such-song__')).toBeUndefined()
    expect(await getAlbumStatic('__no-such-album__')).toBeUndefined()
  })
})
