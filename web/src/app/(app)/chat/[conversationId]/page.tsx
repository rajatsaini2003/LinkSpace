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
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  const fetchConversation = useCallback(async () => {
    try {
      const convs = await apiGet<Conversation[]>('/api/chat')
      const conv = convs.find((c) => c.id === conversationId)
      if (conv) setConversation(conv)
    } catch {
      // ignore
    }
  }, [conversationId])

  const fetchMessages = useCallback(
    async (pageNum: number, prepend = false) => {
      try {
        const data = await apiGet<MessagesResponse>(
          `/api/chat/${conversationId}/messages?page=${pageNum}&limit=50`
        )
        const msgs = data.messages.reverse() // API returns newest first, we want oldest first
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

  // Mark as read
  const markRead = useCallback(async () => {
    try {
      await apiPut(`/api/chat/${conversationId}/read`)
    } catch {
      // silent
    }
  }, [conversationId])

  useEffect(() => {
    fetchConversation()
    fetchMessages(1)
    markRead()
  }, [fetchConversation, fetchMessages, markRead])

  // Poll for new messages every 3 seconds
  useEffect(() => {
    pollingRef.current = setInterval(async () => {
      try {
        const data = await apiGet<MessagesResponse>(
          `/api/chat/${conversationId}/messages?page=1&limit=50`
        )
        const msgs = data.messages.reverse()
        setMessages(msgs)
        markRead()
      } catch {
        // silent
      }
    }, 3000)

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [conversationId, markRead])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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

  const getOtherUser = () => {
    return conversation?.participants.find((p) => p.id !== user?.id)
  }

  const otherUser = getOtherUser()
  const otherInitials =
    otherUser?.displayName
      ?.split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || otherUser?.username?.slice(0, 2).toUpperCase()

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
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto py-4 space-y-1">
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <Skeleton className={`h-10 rounded-2xl ${i % 2 === 0 ? 'w-48' : 'w-36'}`} />
              </div>
            ))}
          </div>
        ) : (
          <>
            {hasMore && (
              <div className="text-center pb-2">
                <Button variant="ghost" size="sm" onClick={loadMore} className="text-xs text-muted-foreground">
                  Load older messages
                </Button>
              </div>
            )}

            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">No messages yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Send a message to start the conversation</p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.senderId === user?.id
                const showTimestamp =
                  idx === 0 ||
                  new Date(msg.createdAt).getTime() - new Date(messages[idx - 1].createdAt).getTime() > 300000

                return (
                  <div key={msg.id}>
                    {showTimestamp && (
                      <div className="text-center py-2">
                        <span className="text-[10px] text-muted-foreground/60 bg-muted/50 px-2 py-0.5 rounded-full">
                          {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} px-1`}>
                      <div
                        className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                          isMe
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-muted rounded-bl-md'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </>
        )}
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
        <Button
          type="submit"
          size="icon"
          className="rounded-full shrink-0"
          disabled={!newMessage.trim() || sending}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}
