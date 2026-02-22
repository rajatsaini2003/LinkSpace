'use client'

import Link from 'next/link'
import { Heart, MessageCircle, ExternalLink, Globe, Lock, Bookmark as BookmarkIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { apiPost } from '@/lib/api'
import { SaveToCollectionModal } from './SaveToCollectionModal'
import type { Bookmark } from '@/types'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

interface Props {
  bookmark: Bookmark
  onLikeToggle?: (id: string, liked: boolean) => void
  showUser?: boolean
}

export function BookmarkCard({ bookmark, onLikeToggle, showUser = true }: Props) {
  const [liked, setLiked] = useState(bookmark.isLiked)
  const [likeCount, setLikeCount] = useState(bookmark._count?.likes ?? 0)
  const [showSaveModal, setShowSaveModal] = useState(false)

  const toggleLike = async () => {
    try {
      const result = await apiPost<{ liked: boolean }>(`/api/bookmarks/${bookmark.id}/like`)
      const nowLiked = result.liked
      setLiked(nowLiked)
      setLikeCount((c) => c + (nowLiked ? 1 : -1))
      onLikeToggle?.(bookmark.id, nowLiked)
    } catch {}
  }

  const domain = (() => {
    try {
      return new URL(bookmark.url).hostname.replace('www.', '')
    } catch {
      return bookmark.url
    }
  })()

  const initials = bookmark.user?.displayName
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || bookmark.user?.username?.slice(0, 2).toUpperCase()

  const timeAgo = formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true })

  return (
    <div className="group rounded-xl border bg-card hover:bg-card/80 transition-all duration-200 hover:shadow-md overflow-hidden">
      {/* Image banner */}
      {bookmark.imageUrl && (
        <div className="h-36 overflow-hidden">
          <img
            src={bookmark.imageUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-4">
        {/* User row */}
        {showUser && bookmark.user && (
          <div className="flex items-center gap-2 mb-3">
            <Link href={`/profile/${bookmark.user.username}`}>
              <Avatar className="w-6 h-6">
                <AvatarImage src={bookmark.user.avatarUrl || undefined} />
                <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
              </Avatar>
            </Link>
            <Link
              href={`/profile/${bookmark.user.username}`}
              className="text-xs text-muted-foreground hover:text-foreground font-medium"
            >
              @{bookmark.user.username}
            </Link>
            <span className="text-xs text-muted-foreground/60">·</span>
            <span className="text-xs text-muted-foreground/60">{timeAgo}</span>
            {!bookmark.isPublic && <Lock className="w-3 h-3 text-muted-foreground/50" />}
          </div>
        )}

        {/* Title + Link */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/bookmarks/${bookmark.id}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {bookmark.title}
            </h3>
          </Link>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Description */}
        {bookmark.description && (
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
            {bookmark.description}
          </p>
        )}

        {/* Domain */}
        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground/70">
          <Globe className="w-3 h-3" />
          {domain}
        </div>

        {/* Tags */}
        {bookmark.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {bookmark.tags.slice(0, 4).map((tag) => (
              <Badge key={tag.id || tag.name} variant="secondary" className="text-[10px] px-2 py-0">
                {tag.name}
              </Badge>
            ))}
            {bookmark.tags.length > 4 && (
              <Badge variant="secondary" className="text-[10px] px-2 py-0">
                +{bookmark.tags.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t">
          <button
            onClick={toggleLike}
            className={cn(
              'flex items-center gap-1.5 text-xs font-medium transition-colors',
              liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
            )}
          >
            <Heart className={cn('w-3.5 h-3.5', liked && 'fill-current')} />
            {likeCount}
          </button>

          <Link
            href={`/bookmarks/${bookmark.id}`}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {bookmark._count?.comments ?? 0}
          </Link>

          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary font-medium ml-auto"
          >
            <BookmarkIcon className="w-3.5 h-3.5" />
            Save
          </button>
        </div>
      </div>

      <SaveToCollectionModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        bookmarkId={bookmark.id}
      />
    </div>
  )
}
