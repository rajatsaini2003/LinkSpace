'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { User, Bookmark } from '@/types'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import BookmarkCard from '@/components/bookmarks/BookmarkCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Loader2Icon, BookmarkIcon, FolderIcon, UsersIcon, CalendarIcon } from 'lucide-react'

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const [userRes, bmsRes] = await Promise.all([
          api.get<User>(`/api/users/${username}`),
          api.get<{ data: Bookmark[] }>(`/api/users/${username}/bookmarks?limit=12`),
        ])
        setProfile(userRes.data)
        setIsFollowing(userRes.data.isFollowing ?? false)
        setBookmarks(bmsRes.data.data ?? [])
      } catch {
        // user not found
      } finally {
        setIsLoading(false)
      }
    }
    if (username) load()
  }, [username])

  const handleFollow = async () => {
    if (!profile) return
    setIsFollowLoading(true)
    try {
      if (isFollowing) {
        await api.delete(`/api/users/${profile.username}/follow`)
        setIsFollowing(false)
        setProfile((p) => p ? { ...p, followersCount: p.followersCount - 1 } : p)
      } else {
        await api.post(`/api/users/${profile.username}/follow`)
        setIsFollowing(true)
        setProfile((p) => p ? { ...p, followersCount: p.followersCount + 1 } : p)
      }
    } catch { /* silent */ } finally {
      setIsFollowLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">User not found.</p>
      </div>
    )
  }

  const isOwnProfile = currentUser?.username === profile.username

  return (
    <div className="space-y-8">
      {/* Profile header */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
            {profile.displayName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold">{profile.displayName}</h1>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              </div>
              {!isOwnProfile && (
                <Button
                  variant={isFollowing ? 'outline' : 'default'}
                  size="sm"
                  onClick={handleFollow}
                  disabled={isFollowLoading}
                  className="shrink-0"
                >
                  {isFollowLoading ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : isFollowing ? (
                    'Unfollow'
                  ) : (
                    'Follow'
                  )}
                </Button>
              )}
            </div>

            {profile.bio && (
              <p className="mt-2 text-sm text-muted-foreground">{profile.bio}</p>
            )}

            {/* Stats */}
            <div className="mt-4 flex flex-wrap gap-5 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <BookmarkIcon className="h-4 w-4" />
                <span className="font-semibold text-foreground">{profile.bookmarksCount}</span> bookmarks
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <FolderIcon className="h-4 w-4" />
                <span className="font-semibold text-foreground">{profile.collectionsCount}</span> collections
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <UsersIcon className="h-4 w-4" />
                <span className="font-semibold text-foreground">{profile.followersCount}</span> followers ·{' '}
                <span className="font-semibold text-foreground">{profile.followingCount}</span> following
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                Joined {formatDate(profile.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookmarks */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">
          {isOwnProfile ? 'My Bookmarks' : `${profile.displayName}'s Bookmarks`}
        </h2>
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <BookmarkIcon className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No public bookmarks yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bm) => (
              <BookmarkCard key={bm.id} bookmark={bm} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
