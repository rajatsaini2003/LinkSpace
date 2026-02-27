'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { apiPost } from '@/lib/api'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import type { Comment } from '@/types'

interface BookmarkCommentsProps {
  bookmarkId: string
  comments: Comment[]
  onCommentAdded: (comment: Comment) => void
  user: { username: string; avatarUrl?: string | null } | null
}

export default function BookmarkComments({
  bookmarkId,
  comments,
  onCommentAdded,
  user,
}: BookmarkCommentsProps) {
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submitComment = async () => {
    if (!comment.trim()) return
    setSubmitting(true)
    try {
      const newComment = await apiPost<Comment>(
        `/api/bookmarks/${bookmarkId}/comments`,
        { content: comment.trim() }
      )
      onCommentAdded(newComment)
      setComment('')
      toast.success('Comment added')
    } catch {
      toast.error('Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Separator />
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Comments ({comments?.length ?? 0})
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
          {comments?.map((c) => (
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
          {!comments?.length && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No comments yet. Be the first!
            </p>
          )}
        </div>
      </div>
    </>
  )
}
