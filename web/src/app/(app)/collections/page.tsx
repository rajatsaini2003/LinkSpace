'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Plus, FolderOpen, Globe, Lock, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { apiGet, apiPost, apiDelete } from '@/lib/api'
import { toast } from 'sonner'
import type { Collection, CreateCollectionInput } from '@/types'

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<CreateCollectionInput>({ name: '', description: '', isPublic: true })

  const fetchCollections = useCallback(async () => {
    try {
      const data = await apiGet<Collection[]>('/api/collections/me')
      setCollections(data || [])
    } catch {
      setCollections([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Name is required')
      return
    }
    setCreating(true)
    try {
      await apiPost('/api/collections', form)
      toast.success('Collection created!')
      setShowCreate(false)
      setForm({ name: '', description: '', isPublic: true })
      fetchCollections()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create collection')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await apiDelete(`/api/collections/${id}`)
      toast.success('Collection deleted')
      setCollections((prev) => prev.filter((c) => c.id !== id))
    } catch {
      toast.error('Failed to delete collection')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize your bookmarks into collections</p>
        </div>
        <Button className="gap-1.5 rounded-full" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> New Collection
        </Button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-5 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No collections yet</p>
          <p className="text-xs mt-1">Create your first collection to organize bookmarks</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => (
            <div
              key={col.id}
              className="group rounded-xl border bg-card hover:bg-card/80 transition-all duration-200 hover:shadow-md p-5 relative"
            >
              <Link href={`/collections/${col.id}`} className="block">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FolderOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                      {col.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      {col.isPublic ? (
                        <Globe className="w-3 h-3" />
                      ) : (
                        <Lock className="w-3 h-3" />
                      )}
                      {col.isPublic ? 'Public' : 'Private'}
                      <span>·</span>
                      <span>{col._count?.bookmarks ?? 0} bookmarks</span>
                    </div>
                  </div>
                </div>
                {col.description && (
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                    {col.description}
                  </p>
                )}
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleDelete(col.id, col.name)
                }}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Collection Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Collection</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="col-name">Name</Label>
              <Input
                id="col-name"
                placeholder="e.g. Design Inspiration"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="col-desc">Description (optional)</Label>
              <Textarea
                id="col-desc"
                placeholder="What's this collection about?"
                rows={2}
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="col-public"
                checked={form.isPublic}
                onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                className="accent-primary"
              />
              <Label htmlFor="col-public" className="text-sm cursor-pointer">
                Make public
              </Label>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={creating}>
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
