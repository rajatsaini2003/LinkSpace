'use client'

import { useEffect, useState } from 'react'
import { FolderOpen, Plus, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { apiGet, apiPost } from '@/lib/api'
import { toast } from 'sonner'
import type { Collection } from '@/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookmarkId: string
}

export function SaveToCollectionModal({ open, onOpenChange, bookmarkId }: Props) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [savedTo, setSavedTo] = useState<Set<string>>(new Set())
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    apiGet<Collection[]>('/api/collections/me')
      .then((data) => setCollections(data || []))
      .catch(() => setCollections([]))
      .finally(() => setLoading(false))
  }, [open])

  const saveToCollection = async (collectionId: string) => {
    setSaving(collectionId)
    try {
      await apiPost(`/api/collections/${collectionId}/bookmarks`, { bookmarkId })
      setSavedTo((prev) => new Set(prev).add(collectionId))
      toast.success('Bookmark saved to collection')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(null)
    }
  }

  const createAndSave = async () => {
    if (!newName.trim()) return
    setCreating(true)
    try {
      const col = await apiPost<Collection>('/api/collections', { name: newName.trim(), isPublic: false })
      await apiPost(`/api/collections/${col.id}/bookmarks`, { bookmarkId })
      setCollections((prev) => [col, ...prev])
      setSavedTo((prev) => new Set(prev).add(col.id))
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
          <DialogTitle>Save to Collection</DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : collections.length === 0 && !showNew ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No collections yet</p>
            </div>
          ) : (
            collections.map((col) => {
              const isSaved = savedTo.has(col.id)
              const isSaving = saving === col.id
              return (
                <button
                  key={col.id}
                  onClick={() => !isSaved && saveToCollection(col.id)}
                  disabled={isSaving || isSaved}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left disabled:opacity-60"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {isSaved ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : (
                      <FolderOpen className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{col.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {col._count?.bookmarks ?? 0} bookmarks
                    </p>
                  </div>
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
            />
            <Button size="sm" onClick={createAndSave} disabled={creating || !newName.trim()}>
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full gap-2 mt-2"
            onClick={() => setShowNew(true)}
          >
            <Plus className="w-4 h-4" /> New Collection
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
