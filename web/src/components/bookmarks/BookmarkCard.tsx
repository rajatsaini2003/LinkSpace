'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Bookmark } from '@/types'
import { formatDate, extractDomain } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HeartIcon, MessageCircleIcon, BookmarkIcon, ExternalLinkIcon } from 'lucide-react'
import { useState } from 'react'
import api from '@/lib/api'

interface BookmarkCardProps {
  bookmark: Bookmark
  onUpdate?: (updated: Bookmark) => void
}

export default function BookmarkCard({ bookmark, onUpdate }: BookmarkCardProps) {
  const [isLiked, setIsLiked] = useState(bookmark.isLiked ?? false)
  const [isSaved, setIsSaved] = useState(bookmark.isSaved ?? false)
  const [likesCount, setLikesCount] = useState(bookmark.likesCount)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      if (isLiked) {
        await api.delete(`/api/bookmarks/${bookmark.id}/like`)
        setLikesCount((c) => c - 1)
      } else {
        await api.post(`/api/bookmarks/${bookmark.id}/like`)
        setLikesCount((c) => c + 1)
      }
      setIsLiked(!isLiked)
    } catch {
      // silently fail
    }
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      if (isSaved) {
        await api.delete(`/api/bookmarks/${bookmark.id}/save`)
      } else {
        await api.post(`/api/bookmarks/${bookmark.id}/save`)
      }
      setIsSaved(!isSaved)
    } catch {
      // silently fail
    }
  }

  return (
    <article className="group flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        {/* Favicon */}
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
          {bookmark.faviconUrl ? (
            <Image
              src={bookmark.faviconUrl}
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
              unoptimized
            />
          ) : (
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              {extractDomain(bookmark.url).charAt(0)}
            </span>
          )}
        </div>

        {/* Title & URL */}
        <div className="min-w-0 flex-1">
          <Link href={`/bookmarks/${bookmark.id}`} className="group/title">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover/title:text-primary">
              {bookmark.title}
            </h3>
          </Link>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <span className="truncate">{extractDomain(bookmark.url)}</span>
            <ExternalLinkIcon className="h-3 w-3 shrink-0" />
          </a>
        </div>
      </div>

      {/* Preview image */}
      {bookmark.imageUrl && (
        <div className="overflow-hidden rounded-md">
          <Image
            src={bookmark.imageUrl}
            alt={bookmark.title}
            width={600}
            height={315}
            className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        </div>
      )}

      {/* Description */}
      {bookmark.description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">{bookmark.description}</p>
      )}

      {/* Tags */}
      {bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {bookmark.tags.slice(0, 5).map((tag) => (
            <Link key={tag.id} href={`/search?tag=${tag.slug}`}>
              <Badge variant="secondary" className="cursor-pointer text-xs hover:bg-primary/10">
                #{tag.name}
              </Badge>
            </Link>
          ))}
          {bookmark.tags.length > 5 && (
            <Badge variant="outline" className="text-xs">
              +{bookmark.tags.length - 5}
            </Badge>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1">
          {/* Author */}
          <Link
            href={`/profile/${bookmark.owner.username}`}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {bookmark.owner.displayName.charAt(0).toUpperCase()}
            </div>
            <span>{bookmark.owner.displayName}</span>
          </Link>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{formatDate(bookmark.createdAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2 text-xs"
            onClick={handleLike}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <HeartIcon
              className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
            />
            <span className="text-muted-foreground">{likesCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2 text-xs"
            aria-label="Comments"
            asChild
          >
            <Link href={`/bookmarks/${bookmark.id}`}>
              <MessageCircleIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{bookmark.commentsCount}</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={handleSave}
            aria-label={isSaved ? 'Unsave' : 'Save'}
          >
            <BookmarkIcon
              className={`h-4 w-4 ${isSaved ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
            />
          </Button>
        </div>
      </div>
    </article>
  )
}
