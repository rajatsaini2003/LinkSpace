'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ExternalLink,
  Heart,
  Globe,
  Lock,
  Send,
  Sparkles,
  Loader2,
  Bookmark as BookmarkIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { apiGet, apiPost } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { SaveToCollectionModal } from '@/components/bookmarks/SaveToCollectionModal'
import type { BookmarkDetail, Comment } from '@/types'

export default function BookmarkDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [bookmark, setBookmark] = useState<BookmarkDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [aiSummary, setAiSummary] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saved, setSaved] = useState(false)

  const fetchBookmark = useCallback(async () => {
    try {
      const bk = await apiGet<BookmarkDetail>(`/api/bookmarks/${id}`)
      setBookmark(bk)
      setLiked(bk.isLiked)
      setLikeCount(bk._count?.likes ?? 0)
      setSaved(bk.isSaved ?? false)
    } catch {
      toast.error('Bookmark not found')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    fetchBookmark()
  }, [fetchBookmark])

  const toggleLike = async () => {
    try {
      const result = await apiPost<{ liked: boolean }>(`/api/bookmarks/${id}/like`)
      const nowLiked = result.liked
      setLiked(nowLiked)
      setLikeCount((c) => c + (nowLiked ? 1 : -1))
    } catch {}
  }

  const submitComment = async () => {
    if (!comment.trim()) return
    setSubmitting(true)
    try {
      const newComment = await apiPost<Comment>(`/api/bookmarks/${id}/comments`, {
        content: comment.trim(),
      })
      setBookmark((prev) =>
        prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : prev
      )
      setComment('')
      toast.success('Comment added')
    } catch {
      toast.error('Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  const getSummary = async () => {
    setAiLoading(true)
    try {
      const res = await apiPost<{ summary: string }>('/api/ai/summarize', {
        url: bookmark?.url,
      })
      setAiSummary(res.summary)
    } catch {
      toast.error('Summarization failed')
    } finally {
      setAiLoading(false)
    }
  }

  const domain = (() => {
    try {
      return new URL(bookmark?.url || '').hostname.replace('www.', '')
    } catch {
      return ''
    }
  })()

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    )
  }

  if (!bookmark) return null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div>
        {bookmark.imageUrl && (
          <div className="h-52 rounded-xl overflow-hidden mb-6">
            <img src={bookmark.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">{bookmark.title}</h1>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground shrink-0 mt-1"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            {domain}
          </div>
          <span>·</span>
          <span>{formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true })}</span>
          {!bookmark.isPublic && (
            <>
              <span>·</span>
              <Lock className="w-3.5 h-3.5" />
            </>
          )}
        </div>

        {bookmark.description && (
          <p className="text-muted-foreground mt-4 leading-relaxed">{bookmark.description}</p>
        )}

        {/* Tags */}
        {bookmark.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {bookmark.tags.map((tag) => (
              <Badge key={tag.id || tag.name} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Author + Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <Link href={`/profile/${bookmark.user.username}`} className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={bookmark.user.avatarUrl || undefined} />
              <AvatarFallback className="text-xs">
                {bookmark.user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{bookmark.user.displayName || bookmark.user.username}</p>
              <p className="text-xs text-muted-foreground">@{bookmark.user.username}</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLike}
              className={cn(liked && 'text-red-500')}
            >
              <Heart className={cn('w-4 h-4 mr-1', liked && 'fill-current')} />
              {likeCount}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveModal(true)}
              className={cn(saved && 'text-primary border-primary/30')}
            >
              <BookmarkIcon className={cn('w-4 h-4 mr-1', saved && 'fill-current')} />
              {saved ? 'Saved' : 'Save'}
            </Button>
            <Button variant="outline" size="sm" onClick={getSummary} disabled={aiLoading}>
              {aiLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Sparkles className="w-4 h-4 mr-1" />
              )}
              AI Summary
            </Button>
          </div>

          <SaveToCollectionModal
            open={showSaveModal}
            onOpenChange={setShowSaveModal}
            bookmarkId={id}
          />
        </div>

        {/* AI Summary */}
        {aiSummary && (
          <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-primary">
              <Sparkles className="w-4 h-4" /> AI Summary
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{aiSummary}</p>
          </div>
        )}
      </div>

      <Separator />

      {/* Comments */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Comments ({bookmark.comments?.length ?? 0})
        </h2>

        {/* Add comment */}
        <div className="flex gap-3 mb-6">
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarImage src={user?.avatarUrl || undefined} />
            <AvatarFallback className="text-xs">
              {user?.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Write a comment..."
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={submitComment} disabled={submitting || !comment.trim()}>
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 mr-1" /> Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Comment list */}
        <div className="space-y-4">
          {bookmark.comments?.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Link href={`/profile/${c.user.username}`}>
                <Avatar className="w-7 h-7">
                  <AvatarImage src={c.user.avatarUrl || undefined} />
                  <AvatarFallback className="text-[10px]">
                    {c.user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/profile/${c.user.username}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {c.user.displayName || c.user.username}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{c.content}</p>
              </div>
            </div>
          ))}
          {!bookmark.comments?.length && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No comments yet. Be the first!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
