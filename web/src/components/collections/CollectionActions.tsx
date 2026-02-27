'use client'

import { useState } from 'react'
import {
  Globe,
  Lock,
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
import { apiPost, apiPut, apiDelete } from '@/lib/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { Collection } from '@/types'

interface CollectionActionsProps {
  collection: {
    id: string
    isPublic: boolean
    shareSlug?: string
    userId: string
  }
  isOwner: boolean
  onVisibilityChanged: (isPublic: boolean) => void
}

export default function CollectionActions({
  collection,
  isOwner,
  onVisibilityChanged,
}: CollectionActionsProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [cloning, setCloning] = useState(false)

  const toggleVisibility = async () => {
    setToggling(true)
    try {
      const updated = await apiPut<Collection>(`/api/collections/${collection.id}`, {
        isPublic: !collection.isPublic,
      })
      onVisibilityChanged(updated.isPublic)
      toast.success(updated.isPublic ? 'Collection is now public' : 'Collection is now private')
    } catch {
      toast.error('Failed to update visibility')
    } finally {
      setToggling(false)
    }
  }

  const copyShareLink = async () => {
    const shareUrl = `${window.location.origin}/shared/collection/${collection.shareSlug}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Share link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
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

  const deleteCollection = async () => {
    if (!confirm('Delete this collection? This cannot be undone.')) return
    try {
      await apiDelete(`/api/collections/${collection.id}`)
      toast.success('Collection deleted')
      router.push('/collections')
    } catch {
      toast.error('Failed to delete collection')
    }
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      {collection.isPublic && (
        <Button variant="outline" size="sm" onClick={copyShareLink} className="gap-1.5">
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Share'}
        </Button>
      )}

      {!isOwner && collection.isPublic && (
        <Button variant="outline" size="sm" onClick={cloneCollection} disabled={cloning} className="gap-1.5">
          {cloning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Save Collection
        </Button>
      )}

      {isOwner && (
        <>
          <Button variant="outline" size="sm" onClick={toggleVisibility} disabled={toggling} className="gap-1.5">
            {toggling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : collection.isPublic ? (
              <ToggleRight className="w-4 h-4" />
            ) : (
              <ToggleLeft className="w-4 h-4" />
            )}
            {collection.isPublic ? 'Make Private' : 'Make Public'}
          </Button>
          <Button variant="ghost" size="sm" onClick={deleteCollection} className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  )
}
