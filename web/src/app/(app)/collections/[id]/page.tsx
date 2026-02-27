'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Globe, Lock, FolderOpen } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { BookmarkGrid } from '@/components/bookmarks/BookmarkGrid'
import CollectionActions from '@/components/collections/CollectionActions'
import { apiGet } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import type { CollectionDetail, Bookmark } from '@/types'

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [collection, setCollection] = useState<CollectionDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const isOwner = collection?.userId === user?.id

  useEffect(() => {
    async function fetch() {
      try {
        const col = await apiGet<CollectionDetail>(`/api/collections/${id}`)
        setCollection(col)
      } catch {
        toast.error('Collection not found')
        router.push('/collections')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, router])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!collection) return null

  const bookmarks: Bookmark[] = collection.bookmarks?.map((b) => ({ ...b })) || []

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{collection.name}</h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                {collection.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                {collection.isPublic ? 'Public' : 'Private'}
                <span>&middot;</span>
                <span>{collection._count?.bookmarks ?? 0} bookmarks</span>
                {collection.user && (
                  <>
                    <span>&middot;</span>
                    <span>by @{collection.user.username}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <CollectionActions
            collection={collection}
            isOwner={isOwner}
            onVisibilityChanged={(isPublic) =>
              setCollection((prev) => (prev ? { ...prev, isPublic } : prev))
            }
          />
        </div>

        {collection.description && (
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            {collection.description}
          </p>
        )}
      </div>

      <BookmarkGrid bookmarks={bookmarks} emptyMessage="This collection is empty" onDeleted={(id) => setCollection((prev) => prev ? { ...prev, bookmarks: prev.bookmarks?.filter((b) => b.id !== id) } : prev)} />
    </div>
  )
}
