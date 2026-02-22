'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { BookmarkIcon, BellIcon, SearchIcon, PlusIcon, LogOutIcon, UserIcon } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Avatar from '@radix-ui/react-avatar'
import { useState } from 'react'
import AddBookmarkModal from '@/components/bookmarks/AddBookmarkModal'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const [addOpen, setAddOpen] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
            <BookmarkIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">LinkSpace</span>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Search */}
              <Link href="/search">
                <Button variant="ghost" size="icon" aria-label="Search">
                  <SearchIcon className="h-5 w-5" />
                </Button>
              </Link>

              {/* Add bookmark */}
              <Button size="sm" onClick={() => setAddOpen(true)} className="gap-1.5">
                <PlusIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Add Bookmark</span>
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <BellIcon className="h-5 w-5" />
              </Button>

              {/* User menu */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <Avatar.Root className="flex h-9 w-9 shrink-0 overflow-hidden rounded-full">
                      <Avatar.Image
                        src={user?.avatarUrl}
                        alt={user?.displayName}
                        className="aspect-square h-full w-full object-cover"
                      />
                      <Avatar.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {user?.displayName?.charAt(0).toUpperCase()}
                      </Avatar.Fallback>
                    </Avatar.Root>
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="z-50 min-w-[180px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                    align="end"
                    sideOffset={8}
                  >
                    <div className="px-2 py-1.5 text-sm font-medium">{user?.displayName}</div>
                    <div className="px-2 py-1 text-xs text-muted-foreground">@{user?.username}</div>
                    <DropdownMenu.Separator className="my-1 h-px bg-muted" />
                    <DropdownMenu.Item asChild>
                      <Link
                        href={`/profile/${user?.username}`}
                        className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        <UserIcon className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="my-1 h-px bg-muted" />
                    <DropdownMenu.Item
                      className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-accent"
                      onSelect={logout}
                    >
                      <LogOutIcon className="h-4 w-4" />
                      Sign out
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button>Get started</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {isAuthenticated && <AddBookmarkModal open={addOpen} onClose={() => setAddOpen(false)} />}
    </>
  )
}
