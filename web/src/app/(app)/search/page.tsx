'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search as SearchIcon, X, Hash } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

  const clearSearch = () => {
    setInput('')
    router.push('/search')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Search</h1>
        <p className="text-sm text-muted-foreground mt-1">Find bookmarks, tags, and more</p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-xl">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search bookmarks, tags, users..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="pl-11 pr-10 h-12 rounded-full bg-muted/50 text-sm"
          autoFocus
        />
        {input && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full"
            onClick={clearSearch}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </form>

      {/* Popular tags */}
      {!query && !tagFilter && popularTags.length > 0 && (
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold">Popular Tags</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button key={tag.id} onClick={() => handleTagClick(tag.name)}>
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors px-3 py-1"
                >
                  {tag.name}
                  {tag.bookmarkCount != null && (
                    <span className="ml-1.5 text-muted-foreground text-[10px]">
                      {tag.bookmarkCount}
                    </span>
                  )}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active filter */}
      {tagFilter && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtering by tag:</span>
          <Badge variant="secondary" className="gap-1">
            {tagFilter}
            <button onClick={clearSearch}>
              <X className="w-3 h-3" />
            </button>
          </Badge>
        </div>
      )}

      {/* Results */}
      {(query || tagFilter) && (
        <div>
          {bookmarks.length > 0 && !loading && (
            <p className="text-xs text-muted-foreground mb-4">
              {bookmarks.length} result{bookmarks.length !== 1 ? 's' : ''} found
            </p>
          )}
          <BookmarkGrid bookmarks={bookmarks} loading={loading} emptyMessage="No results found" />
        </div>
      )}
    </div>
  )
}
