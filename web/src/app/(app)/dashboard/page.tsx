'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Bookmark as BookmarkIcon, FolderOpen, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookmarkGrid } from '@/components/bookmarks/BookmarkGrid'
import { AddBookmarkModal } from '@/components/bookmarks/AddBookmarkModal'
import { useAuth } from '@/contexts/AuthContext'
import { apiGet } from '@/lib/api'
import type { Bookmark } from '@/types'

export default function DashboardPage() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  const fetchBookmarks = useCallback(async () => {
    try {
      const res = await apiGet<{ bookmarks: Bookmark[] }>('/api/bookmarks/me')
      setBookmarks(res.bookmarks || [])
    } catch {
      setBookmarks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  const stats = [
    { icon: BookmarkIcon, label: 'Bookmarks', value: user?._count?.bookmarks ?? 0 },
    { icon: Users, label: 'Followers', value: user?._count?.followers ?? 0 },
    { icon: Users, label: 'Following', value: user?._count?.following ?? 0 },
  ]

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Hey, {user?.displayName?.split(' ')[0] || user?.username} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Here&apos;s your bookmark overview</p>
        </div>
        <Button className="gap-1.5 rounded-full" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4" /> Add Bookmark
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <s.icon className="w-4 h-4" />
              <span className="text-xs font-medium">{s.label}</span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent bookmarks */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Bookmarks</h2>
        <BookmarkGrid bookmarks={bookmarks} loading={loading} showUser={false} emptyMessage="No bookmarks yet. Add your first one!" />
      </div>

      <AddBookmarkModal open={showAdd} onOpenChange={setShowAdd} onCreated={() => fetchBookmarks()} />
    </div>
  )
}
