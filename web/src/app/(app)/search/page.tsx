'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search as SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BookmarkGrid } from '@/components/bookmarks/BookmarkGrid'
import { apiGet } from '@/lib/api'
import type { Bookmark, Tag } from '@/types'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  const tagFilter = searchParams.get('tag') || ''

  const [input, setInput] = useState(query)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [popularTags, setPopularTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)

  const doSearch = useCallback(async (q: string, tag: string) => {
    if (!q && !tag) {
      setBookmarks([])
      return
    }
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (tag) params.set('tag', tag)
      params.set('limit', '20')
      const res = await apiGet<{ bookmarks: Bookmark[] }>(`/api/bookmarks/search?${params}`)
      setBookmarks(res.bookmarks || [])
    } catch {
      setBookmarks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    doSearch(query, tagFilter)
  }, [query, tagFilter, doSearch])

  // Fetch popular tags
  useEffect(() => {
    apiGet<Tag[]>('/api/tags/trending')
      .then((tags) => setPopularTags(tags || []))
      .catch(() => {})
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (input.trim()) params.set('q', input.trim())
    router.push(`/search?${params}`)
  }

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams()
    params.set('tag', tag)
    router.push(`/search?${params}`)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Search</h1>

      <form onSubmit={handleSearch} className="relative max-w-xl">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search bookmarks, tags, users..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="pl-10 h-11"
          autoFocus
        />
      </form>

      {/* Popular tags */}
      {!query && !tagFilter && popularTags.length > 0 && (
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Popular Tags</p>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button key={tag.id} onClick={() => handleTagClick(tag.name)}>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10">
                  {tag.name}
                  {tag.bookmarkCount != null && (
                    <span className="ml-1 text-muted-foreground">({tag.bookmarkCount})</span>
                  )}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {(query || tagFilter) && (
        <div>
          {tagFilter && (
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              Tag:{' '}
              <Badge variant="secondary">{tagFilter}</Badge>
            </div>
          )}
          <BookmarkGrid bookmarks={bookmarks} loading={loading} emptyMessage="No results found" />
        </div>
      )}
    </div>
  )
}
