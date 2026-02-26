'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, CalendarDays, MapPin } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BookmarkGrid } from '@/components/bookmarks/BookmarkGrid'
import { apiGet, apiPost } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import type { UserProfile, Bookmark, Conversation } from '@/types'

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const router = useRouter()
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

  const startChat = async () => {
    if (!profile) return
    try {
      const conversation = await apiPost<Conversation>('/api/chat', {
        participantId: profile.id,
      })
      router.push(`/chat/${conversation.id}`)
    } catch {
      toast.error('Failed to start conversation')
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
      <div className="rounded-2xl border bg-card overflow-hidden">
        {/* Cover gradient */}
        <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />

        <div className="p-6 -mt-12">
          {profile ? (
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <Avatar className="w-24 h-24 ring-4 ring-card shadow-xl">
                <AvatarImage src={profile.avatarUrl || undefined} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 mt-2 sm:mt-8">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-bold">{profile.displayName || profile.username}</h1>
                    <p className="text-sm text-muted-foreground">@{profile.username}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isMe && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full gap-1.5"
                          onClick={startChat}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Message
                        </Button>
                        <Button
                          variant={following ? 'outline' : 'default'}
                          size="sm"
                          className="rounded-full"
                          onClick={toggleFollow}
                          disabled={followLoading}
                        >
                          {following ? 'Following' : 'Follow'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{profile.bio}</p>
                )}

                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Joined {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div>
                    <span className="font-semibold">{profile._count.bookmarks}</span>{' '}
                    <span className="text-muted-foreground">bookmarks</span>
                  </div>
                  <Link
                    href={`/profile/${username}/followers`}
                    className="hover:underline transition-colors"
                  >
                    <span className="font-semibold">{profile._count.followers}</span>{' '}
                    <span className="text-muted-foreground">followers</span>
                  </Link>
                  <Link
                    href={`/profile/${username}/following`}
                    className="hover:underline transition-colors"
                  >
                    <span className="font-semibold">{profile._count.following}</span>{' '}
                    <span className="text-muted-foreground">following</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-5">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-2 flex-1 mt-8">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bookmarks */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Bookmarks</h2>
        <BookmarkGrid bookmarks={bookmarks} loading={loading} showUser={false} />
      </div>
    </div>
  )
}
