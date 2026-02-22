'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Bookmark } from '@/types'
import api from '@/lib/api'
import BookmarkCard from '@/components/bookmarks/BookmarkCard'
import AddBookmarkModal from '@/components/bookmarks/AddBookmarkModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  BookmarkIcon,
  FolderIcon,
  UsersIcon,
  PlusIcon,
  Loader2Icon,
  TrendingUpIcon,
} from 'lucide-react'

interface Stats {
  bookmarksCount: number
  collectionsCount: number
  followersCount: number
  followingCount: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [bookmarksRes, statsRes] = await Promise.all([
          api.get<{ data: Bookmark[] }>('/api/bookmarks?limit=9&sort=newest'),
          api.get<Stats>('/api/users/me/stats'),
        ])
        setBookmarks(bookmarksRes.data.data ?? [])
        setStats(statsRes.data)
      } catch {
        // fallback to empty
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleAdded = (bookmark: Bookmark) => {
    setBookmarks((prev) => [bookmark, ...prev.slice(0, 8)])
  }

  const statCards = [
    {
      label: 'Bookmarks',
      value: stats?.bookmarksCount ?? user?.bookmarksCount ?? 0,
      icon: BookmarkIcon,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      label: 'Collections',
      value: stats?.collectionsCount ?? user?.collectionsCount ?? 0,
      icon: FolderIcon,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
    {
      label: 'Followers',
      value: stats?.followersCount ?? user?.followersCount ?? 0,
      icon: UsersIcon,
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      label: 'Following',
      value: stats?.followingCount ?? user?.followingCount ?? 0,
      icon: TrendingUpIcon,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.displayName?.split(' ')[0]}! 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your bookmarks.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2 hidden sm:flex">
          <PlusIcon className="h-4 w-4" />
          Add Bookmark
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent bookmarks */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Bookmarks</h2>
          <Button variant="ghost" size="sm" onClick={() => setAddOpen(true)} className="gap-1.5">
            <PlusIcon className="h-4 w-4" />
            Add new
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <BookmarkIcon className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="text-base font-semibold">No bookmarks yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Start building your collection by saving your first link.
            </p>
            <Button className="mt-4 gap-2" onClick={() => setAddOpen(true)}>
              <PlusIcon className="h-4 w-4" />
              Add your first bookmark
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bm) => (
              <BookmarkCard key={bm.id} bookmark={bm} />
            ))}
          </div>
        )}
      </div>

      <AddBookmarkModal open={addOpen} onClose={() => setAddOpen(false)} onAdded={handleAdded} />
    </div>
  )
}
