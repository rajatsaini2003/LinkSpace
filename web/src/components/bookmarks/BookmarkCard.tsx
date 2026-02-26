'use client'

import Link from 'next/link'
import { Heart, MessageCircle, ExternalLink, Lock, Bookmark as BookmarkIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { apiPost } from '@/lib/api'
import { SaveToCollectionModal } from './SaveToCollectionModal'
import type { Bookmark } from '@/types'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'

interface Props {
  bookmark: Bookmark
  onLikeToggle?: (id: string, liked: boolean) => void
  showUser?: boolean
}

export function BookmarkCard({ bookmark, onLikeToggle, showUser = true }: Props) {
  const [liked, setLiked] = useState(bookmark.isLiked)
  const [likeCount, setLikeCount] = useState(bookmark._count?.likes ?? 0)
  const [saved, setSaved] = useState(bookmark.isSaved ?? false)
  const [showSaveModal, setShowSaveModal] = useState(false)

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const result = await apiPost<{ liked: boolean }>(`/api/bookmarks/${bookmark.id}/like`)
      const nowLiked = result.liked
      setLiked(nowLiked)
      setLikeCount((c) => c + (nowLiked ? 1 : -1))
      onLikeToggle?.(bookmark.id, nowLiked)
    } catch {}
  }

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowSaveModal(true)
  }

  const domain = (() => {
    try {
      return new URL(bookmark.url).hostname.replace('www.', '')
    } catch {
      return bookmark.url
    }
  })()

  const favicon = (() => {
    try {
      const host = new URL(bookmark.url).origin
      return `https://www.google.com/s2/favicons?domain=${host}&sz=32`
    } catch {
      return null
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
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group relative rounded-2xl border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
      >
        {/* Link preview / Image banner */}
        <Link href={`/bookmarks/${bookmark.id}`} className="block">
          <div className="relative h-44 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
            {bookmark.imageUrl ? (
              <img
                src={bookmark.imageUrl}
                alt={bookmark.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6">
                {favicon && (
                  <img src={favicon} alt="" className="w-8 h-8 rounded" />
                )}
                <div className="text-center">
                  <p className="text-xs font-medium text-muted-foreground/80 line-clamp-1">{domain}</p>
                  <p className="text-sm font-semibold text-foreground/70 mt-1 line-clamp-2">{bookmark.title}</p>
                </div>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              {!bookmark.isPublic && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium">
                  <Lock className="w-2.5 h-2.5" /> Private
                </span>
              )}
            </div>

            {/* Quick actions on hover */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.open(bookmark.url, '_blank', 'noopener,noreferrer')
                }}
                className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Domain pill on image */}
            {bookmark.imageUrl && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                {favicon && <img src={favicon} alt="" className="w-3.5 h-3.5 rounded-sm" />}
                <span className="text-[11px] text-white font-medium">{domain}</span>
              </div>
            )}
          </div>
        </Link>

        <div className="p-4">
          {/* User row */}
          {showUser && bookmark.user && (
            <div className="flex items-center gap-2 mb-3">
              <Link href={`/profile/${bookmark.user.username}`}>
                <Avatar className="w-6 h-6 ring-2 ring-background">
                  <AvatarImage src={bookmark.user.avatarUrl || undefined} />
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
              </Link>
              <Link
                href={`/profile/${bookmark.user.username}`}
                className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                {bookmark.user.displayName || `@${bookmark.user.username}`}
              </Link>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-[11px] text-muted-foreground/50">{timeAgo}</span>
            </div>
          )}

          {/* Title */}
          <Link href={`/bookmarks/${bookmark.id}`}>
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {bookmark.title}
            </h3>
          </Link>

          {/* Description */}
          {bookmark.description && (
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
              {bookmark.description}
            </p>
          )}

          {/* Tags */}
          {bookmark.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {bookmark.tags.slice(0, 3).map((tag) => (
                <Link key={tag.id || tag.name} href={`/search?tag=${tag.name}`}>
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-2 py-0 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
              {bookmark.tags.length > 3 && (
                <Badge variant="secondary" className="text-[10px] px-2 py-0 text-muted-foreground">
                  +{bookmark.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Actions bar */}
          <div className="flex items-center gap-1 mt-3 pt-3 border-t">
            <button
              onClick={toggleLike}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                liked
                  ? 'text-red-500 bg-red-500/10'
                  : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/5'
              )}
            >
              <Heart className={cn('w-3.5 h-3.5 transition-transform', liked && 'fill-current scale-110')} />
              {likeCount > 0 && likeCount}
            </button>

            <Link
              href={`/bookmarks/${bookmark.id}`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium transition-all duration-200"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {(bookmark._count?.comments ?? 0) > 0 && bookmark._count.comments}
            </Link>

            <button
              onClick={handleSaveClick}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ml-auto',
                saved
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              )}
            >
              <BookmarkIcon className={cn('w-3.5 h-3.5 transition-transform', saved && 'fill-current')} />
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </motion.div>

      <SaveToCollectionModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        bookmarkId={bookmark.id}
        onSaveStatusChange={(anySaved) => setSaved(anySaved)}
      />
    </>
  )
}
