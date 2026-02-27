'use client'

import { Globe, ExternalLink, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Bookmark } from '@/types'

export default function SharedBookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  const domain = (() => {
    try {
      return new URL(bookmark.url).hostname.replace('www.', '')
    } catch {
      return bookmark.url
    }
  })()

  return (
    <div className="group rounded-xl border bg-card hover:bg-card/80 transition-all duration-200 hover:shadow-md overflow-hidden">
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
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {bookmark.title}
          </h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        {bookmark.description && (
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
            {bookmark.description}
          </p>
        )}
        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground/70">
          <Globe className="w-3 h-3" />
          {domain}
        </div>
        {bookmark.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {bookmark.tags.slice(0, 4).map((tag) => (
              <Badge key={tag.id || tag.name} variant="secondary" className="text-[10px] px-2 py-0">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            {bookmark._count?.likes ?? 0}
          </span>
        </div>
      </div>
    </div>
  )
}
