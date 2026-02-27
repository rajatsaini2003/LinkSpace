'use client'

import { useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'
import type { Message } from '@/types'

interface ChatMessageListProps {
  messages: Message[]
  loading: boolean
  hasMore: boolean
  userId?: string
  onLoadMore: () => void
}

export default function ChatMessageList({
  messages,
  loading,
  hasMore,
  userId,
  onLoadMore,
}: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <Skeleton className={`h-10 rounded-2xl ${i % 2 === 0 ? 'w-48' : 'w-36'}`} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {hasMore && (
        <div className="text-center pb-2">
          <Button variant="ghost" size="sm" onClick={onLoadMore} className="text-xs text-muted-foreground">
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
          const isMe = msg.senderId === userId
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
  )
}
