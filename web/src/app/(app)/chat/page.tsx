'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { MessageCircle, Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { apiGet } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import type { Conversation } from '@/types'

export default function ChatPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchConversations = useCallback(async () => {
    try {
      const data = await apiGet<Conversation[]>('/api/chat')
      setConversations(data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find((p) => p.id !== user?.id)
  }

  const filtered = conversations.filter((conv) => {
    if (!search) return true
    const other = getOtherParticipant(conv)
    if (!other) return false
    return (
      other.username.toLowerCase().includes(search.toLowerCase()) ||
      other.displayName?.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          className="pl-10 rounded-full bg-muted/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden divide-y">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-3 w-12" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">
              {search ? 'No conversations match your search' : 'No conversations yet'}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Visit a user&apos;s profile to start a conversation
            </p>
          </div>
        ) : (
          filtered.map((conv) => {
            const other = getOtherParticipant(conv)
            if (!other) return null

            const initials =
              other.displayName
                ?.split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || other.username.slice(0, 2).toUpperCase()

            return (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={other.avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                      {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium truncate ${conv.unreadCount > 0 ? 'font-semibold' : ''}`}>
                      {other.displayName || other.username}
                    </p>
                    {conv.lastMessage && (
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: false })}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage ? (
                    <p
                      className={`text-xs truncate mt-0.5 ${
                        conv.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
                      }`}
                    >
                      {conv.lastMessage.senderId === user?.id ? 'You: ' : ''}
                      {conv.lastMessage.content}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground/60 mt-0.5">No messages yet</p>
                  )}
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
