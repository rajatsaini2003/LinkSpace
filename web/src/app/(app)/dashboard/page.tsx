'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Plus,
  Bookmark as BookmarkIcon,
  FolderOpen,
  Users,
  TrendingUp,
  Heart,
  ArrowUpRight,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookmarkGrid } from '@/components/bookmarks/BookmarkGrid'
import { AddBookmarkModal } from '@/components/bookmarks/AddBookmarkModal'
import { useAuth } from '@/contexts/AuthContext'
import { apiGet } from '@/lib/api'
import type { Bookmark, Collection } from '@/types'

export default function DashboardPage() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [bmRes, colRes] = await Promise.allSettled([
        apiGet<{ bookmarks: Bookmark[] }>('/api/bookmarks/me'),
        apiGet<Collection[]>('/api/collections'),
      ])
      if (bmRes.status === 'fulfilled') setBookmarks(bmRes.value.bookmarks || [])
      if (colRes.status === 'fulfilled') setCollections(colRes.value || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalLikes = bookmarks.reduce((sum, b) => sum + (b._count?.likes || 0), 0)

  const stats = [
    {
      icon: BookmarkIcon,
      label: 'Bookmarks',
      value: user?._count?.bookmarks ?? 0,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      icon: FolderOpen,
      label: 'Collections',
      value: collections.length,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      icon: Users,
      label: 'Followers',
      value: user?._count?.followers ?? 0,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: Heart,
      label: 'Total Likes',
      value: totalLikes,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.displayName?.split(' ')[0] || user?.username}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your bookmarks
          </p>
        </div>
        <Button className="gap-1.5 rounded-full" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4" /> Add Bookmark
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/feed"
          className="group rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent p-5 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Explore Feed</p>
                <p className="text-xs text-muted-foreground">Discover trending bookmarks</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </Link>
        <Link
          href="/collections"
          className="group rounded-2xl border bg-gradient-to-br from-amber-500/5 to-transparent p-5 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">Your Collections</p>
                <p className="text-xs text-muted-foreground">
                  {collections.length} collection{collections.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Recent Bookmarks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Bookmarks</h2>
          {bookmarks.length > 6 && (
            <Link href="/bookmarks" className="text-sm text-primary hover:underline">
              View all
            </Link>
          )}
        </div>
        <BookmarkGrid
          bookmarks={bookmarks.slice(0, 6)}
          loading={loading}
          showUser={false}
          emptyMessage="No bookmarks yet. Add your first one!"
        />
      </div>

      <AddBookmarkModal open={showAdd} onOpenChange={setShowAdd} onCreated={() => fetchData()} />
    </div>
  )
}
