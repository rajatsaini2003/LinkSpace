'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bookmark,
  LayoutDashboard,
  TrendingUp,
  FolderOpen,
  Search,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/feed', label: 'Feed', icon: TrendingUp },
  { href: '/search', label: 'Search', icon: Search },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col border-r bg-card/50 z-40">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-6 font-bold text-lg border-b">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Bookmark className="w-4 h-4 text-primary-foreground" />
          </div>
          LinkSpace
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <item.icon className="w-4.5 h-4.5" />
                {item.label}
              </Link>
            )
          })}

          {/* User specific */}
          {user && (
            <>
              <div className="pt-4 pb-2 px-3">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Library
                </p>
              </div>
              <Link
                href="/collections"
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith('/collections')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <FolderOpen className="w-4.5 h-4.5" />
                Collections
              </Link>
              <Link
                href={`/profile/${user.username}`}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith('/profile')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <User className="w-4.5 h-4.5" />
                Profile
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-around h-14">
          {[
            ...navItems,
            ...(user
              ? [{ href: `/profile/${user.username}`, label: 'Profile', icon: User }]
              : []),
          ].map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors p-1',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
