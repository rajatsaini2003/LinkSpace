'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { apiPost } from '@/lib/api'
import { toast } from 'sonner'
import type { Bookmark, CreateBookmarkInput } from '@/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (bookmark: Bookmark) => void
}

export function AddBookmarkModal({ open, onOpenChange, onCreated }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CreateBookmarkInput>({
    url: '',
    title: '',
    description: '',
    tags: [],
    isPublic: true,
  })
  const [tagInput, setTagInput] = useState('')

  const set = (key: keyof CreateBookmarkInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value })

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !form.tags?.includes(tag)) {
      setForm({ ...form, tags: [...(form.tags || []), tag] })
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags?.filter((t) => t !== tag) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.url || !form.title) {
      toast.error('URL and title are required')
      return
    }
    setLoading(true)
    try {
      const bookmark = await apiPost<Bookmark>('/api/bookmarks', form)
      toast.success('Bookmark added!')
      onCreated?.(bookmark)
      onOpenChange(false)
      setForm({ url: '', title: '', description: '', tags: [], isPublic: true })
      router.refresh()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add bookmark')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Bookmark</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="bk-url">URL</Label>
            <Input id="bk-url" placeholder="https://..." value={form.url} onChange={set('url')} autoFocus />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bk-title">Title</Label>
            <Input id="bk-title" placeholder="Page title" value={form.title} onChange={set('title')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bk-desc">Description (optional)</Label>
            <Textarea
              id="bk-desc"
              placeholder="Brief description..."
              rows={2}
              value={form.description || ''}
              onChange={set('description')}
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>
                Add
              </Button>
            </div>
            {form.tags && form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="bk-public"
              checked={form.isPublic}
              onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
              className="accent-primary"
            />
            <Label htmlFor="bk-public" className="text-sm cursor-pointer">
              Make public
            </Label>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
