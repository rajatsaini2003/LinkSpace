'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookmarkGrid } from '@/components/bookmarks/BookmarkGrid'
import { apiGet } from '@/lib/api'
import { Flame, Clock, UserCheck } from 'lucide-react'
import type { Bookmark } from '@/types'

type FeedTab = 'trending' | 'latest' | 'following'

const tabConfig: { value: FeedTab; label: string; icon: React.ElementType }[] = [
  { value: 'trending', label: 'Trending', icon: Flame },
  { value: 'latest', label: 'Latest', icon: Clock },
  { value: 'following', label: 'Following', icon: UserCheck },
]

export default function FeedPage() {
  const [tab, setTab] = useState<FeedTab>('trending')
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<HTMLDivElement>(null)

  const fetchFeed = useCallback(async (feedTab: FeedTab, pageNum: number, append = false) => {
    try {
      setLoading(!append)
      const endpoint =
        feedTab === 'following'
          ? '/api/feed/following'
          : feedTab === 'latest'
            ? '/api/feed'
            : '/api/feed/trending'
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: '12',
      })
      const res = await apiGet<{ bookmarks: Bookmark[]; hasNextPage: boolean }>(
        `${endpoint}?${params}`
      )
      const list = res.bookmarks ?? []
      setBookmarks((prev) => (append ? [...prev, ...list] : list))
      setHasMore(res.hasNextPage ?? false)
    } catch {
      if (!append) setBookmarks([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setPage(1)
    setBookmarks([])
    fetchFeed(tab, 1)
  }, [tab, fetchFeed])

  // Infinite scroll
  useEffect(() => {
    if (!observerRef.current || !hasMore) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          const next = page + 1
          setPage(next)
          fetchFeed(tab, next, true)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, page, tab, fetchFeed])

  const emptyMessages: Record<FeedTab, string> = {
    trending: 'No trending bookmarks right now',
    latest: 'No bookmarks have been shared yet',
    following: 'Follow people to see their bookmarks here',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feed</h1>
          <p className="text-sm text-muted-foreground mt-1">Discover bookmarks from the community</p>
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as FeedTab)}>
          <TabsList className="bg-muted/50">
            {tabConfig.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="gap-1.5 text-xs">
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <BookmarkGrid
        bookmarks={bookmarks}
        loading={loading}
        emptyMessage={emptyMessages[tab]}
      />

      {/* Infinite scroll trigger */}
      {hasMore && <div ref={observerRef} className="h-8" />}
    </div>
  )
}
