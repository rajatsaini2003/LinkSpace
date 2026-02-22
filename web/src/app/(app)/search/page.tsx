'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Bookmark } from '@/types'
import api from '@/lib/api'
import BookmarkCard from '@/components/bookmarks/BookmarkCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchIcon, Loader2Icon, XIcon } from 'lucide-react'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [tag, setTag] = useState(searchParams.get('tag') ?? '')
  const [results, setResults] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [total, setTotal] = useState(0)

  const doSearch = useCallback(async (q: string, t: string) => {
    if (!q && !t) {
      setResults([])
      setHasSearched(false)
      return
    }
    setIsLoading(true)
    setHasSearched(true)
    try {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (t) params.set('tag', t)
      params.set('limit', '20')
      const { data } = await api.get<{ data: Bookmark[]; total: number }>(
        `/api/search?${params.toString()}`
      )
      setResults(data.data ?? [])
      setTotal(data.total ?? 0)
    } catch {
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Search when URL params change
  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    const t = searchParams.get('tag') ?? ''
    setQuery(q)
    setTag(t)
    doSearch(q, t)
  }, [searchParams, doSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (tag) params.set('tag', tag)
    router.push(`/search?${params.toString()}`)
  }

  const clearTag = () => {
    setTag('')
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find bookmarks by title, description, URL, or tag
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bookmarks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : 'Search'}
        </Button>
      </form>

      {/* Active tag filter */}
      {tag && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtering by tag:</span>
          <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            #{tag}
            <button onClick={clearTag} className="ml-1 rounded-full hover:text-foreground">
              <XIcon className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : hasSearched ? (
        <>
          <p className="text-sm text-muted-foreground">
            {total > 0
              ? `Found ${total} result${total !== 1 ? 's' : ''}`
              : 'No results found'}
          </p>
          {results.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((bm) => (
                <BookmarkCard key={bm.id} bookmark={bm} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
              <SearchIcon className="mb-4 h-12 w-12 text-muted-foreground/40" />
              <h3 className="text-base font-semibold">No bookmarks found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try different keywords or remove filters.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <SearchIcon className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-base font-semibold">Search for bookmarks</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter a query above to search across all public bookmarks.
          </p>
        </div>
      )}
    </div>
  )
}
