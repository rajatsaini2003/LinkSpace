'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import {
  LayoutDashboardIcon,
  RssIcon,
  BookmarkIcon,
  FolderIcon,
  SearchIcon,
  TrendingUpIcon,
  UsersIcon,
  TagIcon,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { href: '/feed', label: 'Feed', icon: RssIcon },
  { href: '/search', label: 'Explore', icon: SearchIcon },
]

const libraryItems = [
  { href: '/bookmarks', label: 'All Bookmarks', icon: BookmarkIcon },
  { href: '/collections', label: 'Collections', icon: FolderIcon },
  { href: '/tags', label: 'Tags', icon: TagIcon },
]

const discoverItems = [
  { href: '/trending', label: 'Trending', icon: TrendingUpIcon },
  { href: '/people', label: 'People', icon: UsersIcon },
]

function NavLink({
  href,
  label,
  icon: Icon,
}: {
  href: string
  label: string
  icon: React.ElementType
}) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  )
}

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="hidden w-56 shrink-0 flex-col lg:flex">
      <div className="sticky top-16 flex flex-col gap-1 overflow-y-auto py-6">
        <div className="mb-1 px-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Main
          </p>
        </div>
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}

        <div className="mb-1 mt-4 px-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            My Library
          </p>
        </div>
        {libraryItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}

        <div className="mb-1 mt-4 px-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Discover
          </p>
        </div>
        {discoverItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}

        {user && (
          <div className="mt-auto pt-6">
            <Link
              href={`/profile/${user.username}`}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="truncate font-medium text-foreground">{user.displayName}</div>
                <div className="truncate text-xs text-muted-foreground">@{user.username}</div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}
