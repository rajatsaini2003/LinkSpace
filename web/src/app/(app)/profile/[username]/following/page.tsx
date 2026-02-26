'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { apiGet, apiPost } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import type { FollowUser } from '@/types'

export default function FollowingPage() {
  const { username } = useParams<{ username: string }>()
  const { user: me } = useAuth()
  const [following, setFollowing] = useState<FollowUser[]>([])
  const [loading, setLoading] = useState(true)
  const [myFollowingSet, setMyFollowingSet] = useState<Set<string>>(new Set())
  const [toggleLoading, setToggleLoading] = useState<string | null>(null)

  const fetchFollowing = useCallback(async () => {
    try {
      const res = await apiGet<{ following: FollowUser[] }>(`/api/users/${username}/following?limit=50`)
      setFollowing(res.following || [])
    } catch {
      toast.error('Failed to load following')
    } finally {
      setLoading(false)
    }
  }, [username])

  const fetchMyFollowing = useCallback(async () => {
    if (!me) return
    try {
      const res = await apiGet<{ following: FollowUser[] }>(`/api/users/${me.username}/following?limit=200`)
      setMyFollowingSet(new Set((res.following || []).map((u) => u.id)))
    } catch {}
  }, [me])

  useEffect(() => {
    fetchFollowing()
    fetchMyFollowing()
  }, [fetchFollowing, fetchMyFollowing])

  const toggleFollow = async (userId: string) => {
    setToggleLoading(userId)
    try {
      const result = await apiPost<{ following: boolean }>(`/api/users/follow/${userId}`)
      setMyFollowingSet((prev) => {
        const next = new Set(prev)
        result.following ? next.add(userId) : next.delete(userId)
        return next
      })
    } catch {
      toast.error('Action failed')
    } finally {
      setToggleLoading(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/profile/${username}`}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Following</h1>
          <p className="text-sm text-muted-foreground">@{username}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : following.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">Not following anyone</p>
          <p className="text-sm mt-1">When @{username} follows people, they&apos;ll show up here.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {following.map((user) => {
            const isMe = me?.id === user.id
            const amFollowing = myFollowingSet.has(user.id)
            return (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <Link href={`/profile/${user.username}`}>
                  <Avatar className="w-11 h-11 ring-2 ring-background">
                    <AvatarImage src={user.avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {user.displayName?.charAt(0) || user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${user.username}`} className="hover:underline">
                    <p className="text-sm font-semibold truncate">
                      {user.displayName || user.username}
                    </p>
                  </Link>
                  <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                  {user.bio && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{user.bio}</p>
                  )}
                </div>
                {!isMe && (
                  <Button
                    variant={amFollowing ? 'outline' : 'default'}
                    size="sm"
                    className="rounded-full text-xs px-4"
                    onClick={() => toggleFollow(user.id)}
                    disabled={toggleLoading === user.id}
                  >
                    {toggleLoading === user.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : amFollowing ? (
                      'Following'
                    ) : (
                      'Follow'
                    )}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
