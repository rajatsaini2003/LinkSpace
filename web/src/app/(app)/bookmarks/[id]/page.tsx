'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Bookmark, Comment } from '@/types'
import api from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate, extractDomain } from '@/lib/utils'
import {
  HeartIcon,
  BookmarkIcon,
  ExternalLinkIcon,
  ArrowLeftIcon,
  Loader2Icon,
  SendIcon,
  MessageCircleIcon,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function BookmarkDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [bookmark, setBookmark] = useState<Bookmark | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const { data } = await api.get<Bookmark>(`/api/bookmarks/${id}`)
        setBookmark(data)
        setIsLiked(data.isLiked ?? false)
        setIsSaved(data.isSaved ?? false)
        setLikesCount(data.likesCount)
        setComments(data.comments ?? [])
      } catch {
        router.replace('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }
    if (id) load()
  }, [id, router])

  const handleLike = async () => {
    try {
      if (isLiked) {
        await api.delete(`/api/bookmarks/${id}/like`)
        setLikesCount((c) => c - 1)
      } else {
        await api.post(`/api/bookmarks/${id}/like`)
        setLikesCount((c) => c + 1)
      }
      setIsLiked(!isLiked)
    } catch { /* silent */ }
  }

  const handleSave = async () => {
    try {
      if (isSaved) {
        await api.delete(`/api/bookmarks/${id}/save`)
      } else {
        await api.post(`/api/bookmarks/${id}/save`)
      }
      setIsSaved(!isSaved)
    } catch { /* silent */ }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setIsSubmitting(true)
    try {
      const { data } = await api.post<Comment>(`/api/bookmarks/${id}/comments`, {
        content: commentText,
      })
      setComments((prev) => [...prev, data])
      setCommentText('')
    } catch { /* silent */ } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!bookmark) return null

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 -ml-2">
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </Button>

      <article className="rounded-xl border bg-card shadow-sm">
        {bookmark.imageUrl && (
          <div className="overflow-hidden rounded-t-xl">
            <Image
              src={bookmark.imageUrl}
              alt={bookmark.title}
              width={800}
              height={400}
              className="h-64 w-full object-cover"
              unoptimized
            />
          </div>
        )}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted text-sm font-bold">
              {extractDomain(bookmark.url).charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold leading-snug">{bookmark.title}</h1>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <span className="truncate">{extractDomain(bookmark.url)}</span>
                <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" />
              </a>
            </div>
          </div>

          {bookmark.description && (
            <p className="mt-4 text-muted-foreground">{bookmark.description}</p>
          )}

          {/* Tags */}
          {bookmark.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {bookmark.tags.map((tag) => (
                <Link key={tag.id} href={`/search?tag=${tag.slug}`}>
                  <Badge variant="secondary" className="cursor-pointer">
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Author & date */}
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href={`/profile/${bookmark.owner.username}`}
              className="font-medium text-foreground hover:text-primary"
            >
              {bookmark.owner.displayName}
            </Link>
            <span>·</span>
            <span>{formatDate(bookmark.createdAt)}</span>
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center gap-2 border-t pt-4">
            <Button
              variant={isLiked ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={handleLike}
            >
              <HeartIcon className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
            </Button>
            <Button
              variant={isSaved ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={handleSave}
            >
              <BookmarkIcon className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="ml-auto">
              <Button size="sm" className="gap-2">
                <ExternalLinkIcon className="h-4 w-4" />
                Visit Link
              </Button>
            </a>
          </div>
        </div>
      </article>

      {/* Comments */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <MessageCircleIcon className="h-5 w-5" />
          Comments ({comments.length})
        </h2>

        {/* Comment form */}
        {user && (
          <form onSubmit={handleComment} className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isSubmitting || !commentText.trim()}>
              {isSubmitting ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
            </Button>
          </form>
        )}

        {/* Comment list */}
        {comments.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 rounded-lg border bg-card p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {comment.author.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <Link
                      href={`/profile/${comment.author.username}`}
                      className="text-sm font-semibold hover:text-primary"
                    >
                      {comment.author.displayName}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
