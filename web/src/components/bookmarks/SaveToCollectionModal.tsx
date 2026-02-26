'use client'

import { useEffect, useState } from 'react'
import { FolderOpen, Plus, Check, Loader2, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { apiGet, apiPost } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { CollectionWithSaveStatus } from '@/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookmarkId: string
  onSaveStatusChange?: (anySaved: boolean) => void
}

export function SaveToCollectionModal({ open, onOpenChange, bookmarkId, onSaveStatusChange }: Props) {
  const [collections, setCollections] = useState<CollectionWithSaveStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    apiGet<CollectionWithSaveStatus[]>(`/api/bookmarks/${bookmarkId}/collections`)
      .then((data) => setCollections(data || []))
      .catch(() => setCollections([]))
      .finally(() => setLoading(false))
  }, [open, bookmarkId])

  // Notify parent whenever save status changes
  useEffect(() => {
    const anySaved = collections.some((c) => c.isSaved)
    onSaveStatusChange?.(anySaved)
  }, [collections, onSaveStatusChange])

  const toggleCollection = async (collectionId: string) => {
    setToggling(collectionId)
    try {
      const result = await apiPost<{ saved: boolean }>(`/api/bookmarks/${bookmarkId}/toggle-collection`, {
        collectionId,
      })
      setCollections((prev) =>
        prev.map((c) =>
          c.id === collectionId
            ? {
                ...c,
                isSaved: result.saved,
                _count: {
                  ...c._count,
                  bookmarks: c._count.bookmarks + (result.saved ? 1 : -1),
                },
              }
            : c
        )
      )
      toast.success(result.saved ? 'Saved to collection' : 'Removed from collection')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update')
    } finally {
      setToggling(null)
    }
  }

  const createAndSave = async () => {
    if (!newName.trim()) return
    setCreating(true)
    try {
      const col = await apiPost<{ id: string; name: string }>('/api/collections', {
        name: newName.trim(),
        isPublic: false,
      })
      // Now save bookmark to the new collection
      await apiPost(`/api/bookmarks/${bookmarkId}/toggle-collection`, {
        collectionId: col.id,
      })
      setCollections((prev) => [
        {
          id: col.id,
          name: col.name,
          description: null,
          isPublic: false,
          _count: { bookmarks: 1 },
          isSaved: true,
        },
        ...prev,
      ])
      setNewName('')
      setShowNew(false)
      toast.success(`Saved to "${col.name}"`)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create collection')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-primary" />
            Save to Collection
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-muted-foreground -mt-1">
          Tap a collection to save or unsave this bookmark
        </p>

        <div className="mt-2 space-y-1 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : collections.length === 0 && !showNew ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No collections yet</p>
              <p className="text-xs mt-1">Create one to start saving</p>
            </div>
          ) : (
            collections.map((col) => {
              const isSaved = col.isSaved
              const isToggling = toggling === col.id
              return (
                <button
                  key={col.id}
                  onClick={() => toggleCollection(col.id)}
                  disabled={isToggling}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left',
                    isSaved
                      ? 'bg-primary/10 border border-primary/20 hover:bg-primary/15'
                      : 'hover:bg-muted/50 border border-transparent'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                      isSaved ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isToggling ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isSaved ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <FolderOpen className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn('text-sm font-medium truncate', isSaved && 'text-primary')}>
                      {col.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {col._count?.bookmarks ?? 0} bookmarks
                    </p>
                  </div>
                  {isSaved && (
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Saved
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Create new collection inline */}
        {showNew ? (
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Collection name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  createAndSave()
                }
              }}
              autoFocus
              className="rounded-xl"
            />
            <Button size="sm" onClick={createAndSave} disabled={creating || !newName.trim()} className="rounded-xl">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full gap-2 mt-2 rounded-xl"
            onClick={() => setShowNew(true)}
          >
            <Plus className="w-4 h-4" /> New Collection
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
