'use client'

import { BookmarkCard } from './BookmarkCard'
import { Skeleton } from '@/components/ui/skeleton'
import type { Bookmark } from '@/types'

interface Props {
  bookmarks: Bookmark[]
  loading?: boolean
  emptyMessage?: string
  showUser?: boolean
}

export function BookmarkGrid({ bookmarks, loading, emptyMessage = 'No bookmarks found', showUser }: Props) {
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 space-y-3">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookmarks.map((bk) => (
        <BookmarkCard key={bk.id} bookmark={bk} showUser={showUser} />
      ))}
    </div>
  )
}
