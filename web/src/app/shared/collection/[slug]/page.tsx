'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Globe,
  FolderOpen,
  Download,
  Loader2,
  Bookmark as BookmarkIcon,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { apiGet, apiPost } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import SharedBookmarkCard from '@/components/bookmarks/SharedBookmarkCard'
import type { CollectionDetail, Collection } from '@/types'

export default function SharedCollectionPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [collection, setCollection] = useState<CollectionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [cloning, setCloning] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetch() {
      try {
        const col = await apiGet<CollectionDetail>(`/api/collections/share/${slug}`)
        setCollection(col)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [slug])

  const cloneCollection = async () => {
    if (!collection) return
    if (!isAuthenticated) {
      toast.error('Please log in to save collections')
      router.push('/login')
      return
    }
    setCloning(true)
    try {
      await apiPost<Collection>(`/api/collections/${collection.id}/clone`)
      toast.success('Collection saved to your library!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save collection')
    } finally {
      setCloning(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-72" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground/30" />
          <h1 className="text-2xl font-bold">Collection Not Found</h1>
          <p className="text-muted-foreground">
            This collection may be private or no longer exists.
          </p>
          <Link href="/login">
            <Button className="gap-2 mt-4">
              <BookmarkIcon className="w-4 h-4" />
              Go to LinkSpace
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const bookmarks = collection.bookmarks || []

  return (
    <div className="min-h-screen bg-background">
      {/* Header bar */}
      <header className="border-b bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <BookmarkIcon className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            LinkSpace
          </Link>
          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1.5">
                Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Collection Info */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <FolderOpen className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{collection.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Globe className="w-3.5 h-3.5" />
                  Public collection
                  <span>&middot;</span>
                  <span>{collection._count?.bookmarks ?? bookmarks.length} bookmarks</span>
                </div>
              </div>
            </div>

            {(!user || user.id !== collection.userId) && (
              <Button onClick={cloneCollection} disabled={cloning} className="gap-2 shrink-0">
                {cloning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Save to Library
              </Button>
            )}
          </div>

          {collection.description && (
            <p className="text-muted-foreground mt-3 leading-relaxed">{collection.description}</p>
          )}

          {collection.user && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <Avatar className="w-7 h-7">
                <AvatarImage src={collection.user.avatarUrl || undefined} />
                <AvatarFallback className="text-xs">
                  {collection.user.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                Curated by <span className="font-medium text-foreground">@{collection.user.username}</span>
              </span>
            </div>
          )}
        </div>

        {/* Bookmarks */}
        {bookmarks.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>This collection is empty</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map((bk) => (
              <SharedBookmarkCard key={bk.id} bookmark={bk} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
