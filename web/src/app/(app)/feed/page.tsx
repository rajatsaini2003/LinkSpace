'use client'

import { useEffect, useState, useCallback } from 'react'
import { Bookmark } from '@/types'
import api from '@/lib/api'
import BookmarkCard from '@/components/bookmarks/BookmarkCard'
import { Button } from '@/components/ui/button'
import { Loader2Icon, FlameIcon, UsersIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type FeedTab = 'trending' | 'following'

export default function FeedPage() {
  const [tab, setTab] = useState<FeedTab>('trending')
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const loadFeed = useCallback(async (feedTab: FeedTab, pageNum: number, append = false) => {
    if (pageNum === 1) setIsLoading(true)
    else setIsLoadingMore(true)
    try {
      const endpoint =
        feedTab === 'trending'
          ? `/api/feed/trending?page=${pageNum}&limit=12`
          : `/api/feed/following?page=${pageNum}&limit=12`
      const { data } = await api.get<{ data: Bookmark[]; totalPages: number }>(endpoint)
      setBookmarks((prev) => (append ? [...prev, ...(data.data ?? [])] : data.data ?? []))
      setTotalPages(data.totalPages ?? 1)
    } catch {
      if (!append) setBookmarks([])
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    setPage(1)
    setBookmarks([])
    loadFeed(tab, 1, false)
  }, [tab, loadFeed])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    loadFeed(tab, next, true)
  }

  const tabs: { id: FeedTab; label: string; icon: React.ElementType }[] = [
    { id: 'trending', label: 'Trending', icon: FlameIcon },
    { id: 'following', label: 'Following', icon: UsersIcon },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feed</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover bookmarks from the community
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border bg-muted p-1 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-all',
              tab === id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <FlameIcon className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-base font-semibold">
            {tab === 'following' ? 'Nothing in your following feed yet' : 'No trending bookmarks'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {tab === 'following'
              ? 'Follow some users to see their bookmarks here.'
              : 'Check back later for trending content.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bm) => (
              <BookmarkCard key={bm.id} bookmark={bm} />
            ))}
          </div>
          {page < totalPages && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load more'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
