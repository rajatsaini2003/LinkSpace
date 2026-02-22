'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Globe,
  Lock,
  FolderOpen,
  Share2,
  Copy,
  Check,
  Download,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { BookmarkGrid } from '@/components/bookmarks/BookmarkGrid'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import type { CollectionDetail, Collection, Bookmark } from '@/types'

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [collection, setCollection] = useState<CollectionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [cloning, setCloning] = useState(false)

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

  const toggleVisibility = async () => {
    if (!collection) return
    setToggling(true)
    try {
      const updated = await apiPut<Collection>(`/api/collections/${id}`, {
        isPublic: !collection.isPublic,
      })
      setCollection((prev) => prev ? { ...prev, isPublic: updated.isPublic } : prev)
      toast.success(updated.isPublic ? 'Collection is now public' : 'Collection is now private')
    } catch {
      toast.error('Failed to update visibility')
    } finally {
      setToggling(false)
    }
  }

  const copyShareLink = async () => {
    if (!collection) return
    const shareUrl = `${window.location.origin}/shared/collection/${collection.shareSlug}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Share link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for insecure contexts
      const input = document.createElement('input')
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      toast.success('Share link copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const cloneCollection = async () => {
    if (!collection) return
    setCloning(true)
    try {
      await apiPost<Collection>(`/api/collections/${id}/clone`)
      toast.success('Collection saved to your library!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save collection')
    } finally {
      setCloning(false)
    }
  }

  const deleteCollection = async () => {
    if (!collection) return
    if (!confirm(`Delete "${collection.name}"? This cannot be undone.`)) return
    try {
      await apiDelete(`/api/collections/${id}`)
      toast.success('Collection deleted')
      router.push('/collections')
    } catch {
      toast.error('Failed to delete collection')
    }
  }

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

  const bookmarks: Bookmark[] = collection.bookmarks?.map((b) => ({
    ...b,
  })) || []

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
                {collection.isPublic ? (
                  <Globe className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                {collection.isPublic ? 'Public' : 'Private'}
                <span>·</span>
                <span>{collection._count?.bookmarks ?? 0} bookmarks</span>
                {collection.user && (
                  <>
                    <span>·</span>
                    <span>by @{collection.user.username}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Share button - always visible for public collections */}
            {collection.isPublic && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyShareLink}
                className="gap-1.5"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                {copied ? 'Copied!' : 'Share'}
              </Button>
            )}

            {/* Clone button - visible for non-owners on public collections */}
            {!isOwner && collection.isPublic && (
              <Button
                variant="outline"
                size="sm"
                onClick={cloneCollection}
                disabled={cloning}
                className="gap-1.5"
              >
                {cloning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Save Collection
              </Button>
            )}

            {/* Owner controls */}
            {isOwner && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleVisibility}
                  disabled={toggling}
                  className="gap-1.5"
                >
                  {toggling ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : collection.isPublic ? (
                    <ToggleRight className="w-4 h-4" />
                  ) : (
                    <ToggleLeft className="w-4 h-4" />
                  )}
                  {collection.isPublic ? 'Make Private' : 'Make Public'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deleteCollection}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {collection.description && (
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            {collection.description}
          </p>
        )}
      </div>

      <BookmarkGrid bookmarks={bookmarks} emptyMessage="This collection is empty" />
    </div>
  )
}
