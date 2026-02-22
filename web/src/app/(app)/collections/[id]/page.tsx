'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Collection, Bookmark } from '@/types'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import BookmarkCard from '@/components/bookmarks/BookmarkCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import {
  FolderIcon,
  BookmarkIcon,
  LockIcon,
  GlobeIcon,
  ArrowLeftIcon,
  Loader2Icon,
} from 'lucide-react'
import Link from 'next/link'

export default function CollectionPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const [colRes, bmsRes] = await Promise.all([
          api.get<Collection>(`/api/collections/${id}`),
          api.get<{ data: Bookmark[] }>(`/api/collections/${id}/bookmarks`),
        ])
        setCollection(colRes.data)
        setBookmarks(bmsRes.data.data ?? [])
      } catch {
        router.replace('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }
    if (id) load()
  }, [id, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!collection) return null

  const isOwner = user?.id === collection.owner.id

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 -ml-2">
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </Button>

      {/* Collection header */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <FolderIcon className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">{collection.name}</h1>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Link
                    href={`/profile/${collection.owner.username}`}
                    className="hover:text-primary"
                  >
                    by {collection.owner.displayName}
                  </Link>
                  <span>·</span>
                  <span>{formatDate(collection.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={collection.isPublic ? 'default' : 'secondary'} className="gap-1">
                  {collection.isPublic ? (
                    <>
                      <GlobeIcon className="h-3 w-3" /> Public
                    </>
                  ) : (
                    <>
                      <LockIcon className="h-3 w-3" /> Private
                    </>
                  )}
                </Badge>
              </div>
            </div>
            {collection.description && (
              <p className="mt-3 text-muted-foreground">{collection.description}</p>
            )}
            <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <BookmarkIcon className="h-4 w-4" />
              <span>{collection.bookmarksCount} bookmarks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bookmarks grid */}
      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <BookmarkIcon className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-base font-semibold">No bookmarks in this collection</h3>
          {isOwner && (
            <p className="mt-1 text-sm text-muted-foreground">
              Add bookmarks to this collection to see them here.
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bm) => (
            <BookmarkCard key={bm.id} bookmark={bm} />
          ))}
        </div>
      )}
    </div>
  )
}
