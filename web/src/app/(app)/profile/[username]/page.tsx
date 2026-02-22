'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BookmarkGrid } from '@/components/bookmarks/BookmarkGrid'
import { apiGet, apiPost } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import type { UserProfile, Bookmark } from '@/types'

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { user: me } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  const isMe = me?.username === username

  const fetchProfile = useCallback(async () => {
    try {
      const p = await apiGet<UserProfile>(`/api/users/${username}`)
      setProfile(p)
      setFollowing(p.isFollowing ?? false)
      // Fetch bookmarks with the user's id
      try {
        const res = await apiGet<{ bookmarks: Bookmark[] }>(`/api/bookmarks?userId=${p.id}`)
        setBookmarks(res.bookmarks || [])
      } catch {
        setBookmarks([])
      }
    } catch {
      toast.error('User not found')
    } finally {
      setLoading(false)
    }
  }, [username])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const toggleFollow = async () => {
    if (!profile) return
    setFollowLoading(true)
    try {
      const result = await apiPost<{ following: boolean }>(`/api/users/follow/${profile.id}`)
      setFollowing(result.following)
      setProfile((p) =>
        p
          ? {
              ...p,
              _count: {
                ...p._count,
                followers: p._count.followers + (result.following ? 1 : -1),
              },
            }
          : p
      )
    } catch {
      toast.error('Action failed')
    } finally {
      setFollowLoading(false)
    }
  }

  if (!profile && !loading) {
    return (
      <div className="text-center py-16 text-muted-foreground">User not found</div>
    )
  }

  const initials =
    profile?.displayName
      ?.split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || profile?.username?.slice(0, 2).toUpperCase()

  return (
    <div className="space-y-8">
      {/* Profile Card */}
      <div className="rounded-xl border bg-card p-6">
        {profile ? (
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatarUrl || undefined} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold">{profile.displayName || profile.username}</h1>
                  <p className="text-sm text-muted-foreground">@{profile.username}</p>
                </div>
                {!isMe && (
                  <Button
                    variant={following ? 'outline' : 'default'}
                    size="sm"
                    className="rounded-full"
                    onClick={toggleFollow}
                    disabled={followLoading}
                  >
                    {following ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>

              {profile.bio && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{profile.bio}</p>
              )}

              <div className="flex items-center gap-6 mt-4 text-sm">
                <div>
                  <span className="font-semibold">{profile._count.bookmarks}</span>{' '}
                  <span className="text-muted-foreground">bookmarks</span>
                </div>
                <div>
                  <span className="font-semibold">{profile._count.followers}</span>{' '}
                  <span className="text-muted-foreground">followers</span>
                </div>
                <div>
                  <span className="font-semibold">{profile._count.following}</span>{' '}
                  <span className="text-muted-foreground">following</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-5">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        )}
      </div>

      {/* Bookmarks */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Bookmarks</h2>
        <BookmarkGrid bookmarks={bookmarks} loading={loading} showUser={false} />
      </div>
    </div>
  )
}
