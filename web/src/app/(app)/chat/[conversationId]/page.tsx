'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { apiGet, apiPost, apiPut } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import ChatMessageList from '@/components/chat/ChatMessageList'
import type { Message, Conversation } from '@/types'

interface MessagesResponse {
  messages: Message[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  const fetchConversation = useCallback(async () => {
    try {
      const convs = await apiGet<Conversation[]>('/api/chat')
      const conv = convs.find((c) => c.id === conversationId)
      if (conv) setConversation(conv)
    } catch {}
  }, [conversationId])

  const fetchMessages = useCallback(
    async (pageNum: number, prepend = false) => {
      try {
        const data = await apiGet<MessagesResponse>(
          `/api/chat/${conversationId}/messages?page=${pageNum}&limit=50`
        )
        const msgs = data.messages.reverse()
        if (prepend) {
          setMessages((prev) => [...msgs, ...prev])
        } else {
          setMessages(msgs)
        }
        setHasMore(pageNum < data.meta.totalPages)
      } catch {
        toast.error('Failed to load messages')
      } finally {
        setLoading(false)
      }
    },
    [conversationId]
  )

  const markRead = useCallback(async () => {
    try { await apiPut(`/api/chat/${conversationId}/read`) } catch {}
  }, [conversationId])

  useEffect(() => {
    fetchConversation()
    fetchMessages(1)
    markRead()
  }, [fetchConversation, fetchMessages, markRead])

  useEffect(() => {
    pollingRef.current = setInterval(async () => {
      try {
        const data = await apiGet<MessagesResponse>(
          `/api/chat/${conversationId}/messages?page=1&limit=50`
        )
        setMessages(data.messages.reverse())
        markRead()
      } catch {}
    }, 3000)
    return () => { if (pollingRef.current) clearInterval(pollingRef.current) }
  }, [conversationId, markRead])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return
    setSending(true)
    try {
      const msg = await apiPost<Message>(`/api/chat/${conversationId}/messages`, {
        content: newMessage.trim(),
      })
      setMessages((prev) => [...prev, msg])
      setNewMessage('')
    } catch {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchMessages(nextPage, true)
  }

  const otherUser = conversation?.participants.find((p) => p.id !== user?.id)
  const otherInitials =
    otherUser?.displayName?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() ||
    otherUser?.username?.slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.push('/chat')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        {otherUser ? (
          <Link href={`/profile/${otherUser.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Avatar className="w-10 h-10">
              <AvatarImage src={otherUser.avatarUrl || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">{otherInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{otherUser.displayName || otherUser.username}</p>
              <p className="text-xs text-muted-foreground">@{otherUser.username}</p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-1">
        <ChatMessageList
          messages={messages}
          loading={loading}
          hasMore={hasMore}
          userId={user?.id}
          onLoadMore={loadMore}
        />
      </div>

      {/* Message input */}
      <form onSubmit={sendMessage} className="flex items-center gap-2 pt-4 border-t">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full bg-muted/50"
          disabled={sending}
          autoFocus
        />
        <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!newMessage.trim() || sending}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}
