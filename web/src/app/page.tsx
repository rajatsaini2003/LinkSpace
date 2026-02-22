import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  BookmarkIcon,
  FolderIcon,
  UsersIcon,
  SearchIcon,
  ShareIcon,
  TagIcon,
  StarIcon,
  ArrowRightIcon,
} from 'lucide-react'

const features = [
  {
    icon: BookmarkIcon,
    title: 'Save Anything',
    description:
      'Capture links from anywhere on the web in seconds. Browser extension coming soon.',
  },
  {
    icon: FolderIcon,
    title: 'Organize with Collections',
    description:
      'Group bookmarks into collections. Keep your digital library tidy and accessible.',
  },
  {
    icon: TagIcon,
    title: 'Smart Tagging',
    description:
      'Tag your bookmarks to find them instantly. Full-text search across all your saved content.',
  },
  {
    icon: UsersIcon,
    title: 'Follow & Discover',
    description:
      'Follow people who share your interests. Discover bookmarks curated by the community.',
  },
  {
    icon: ShareIcon,
    title: 'Share Collections',
    description:
      'Make collections public to share your curated lists with the world.',
  },
  {
    icon: SearchIcon,
    title: 'Powerful Search',
    description:
      'Find any bookmark by title, URL, description, or tag. Lightning-fast results.',
  },
]

const stats = [
  { label: 'Bookmarks saved', value: '2M+' },
  { label: 'Active users', value: '50K+' },
  { label: 'Public collections', value: '120K+' },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <BookmarkIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">LinkSpace</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
              How it works
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-background" />
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-4 inline-flex items-center rounded-full border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
              <StarIcon className="mr-2 h-3.5 w-3.5 text-yellow-500" />
              The social bookmarking platform for curious minds
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Save, Organize &amp;{' '}
              <span className="text-primary">Discover</span> the best of the web
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              LinkSpace is your personal library for the internet. Save links, organize them into
              collections, and discover what the community is reading — all in one place.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="gap-2 px-8">
                  Start for free
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/feed">
                <Button variant="outline" size="lg" className="px-8">
                  Explore public feed
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y bg-muted/30 py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl font-extrabold text-primary">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need for your bookmarks
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Powerful features to help you save smarter and discover more.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-muted/30 py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Three simple steps to get started.
              </p>
            </div>
            <div className="mt-16 grid gap-10 sm:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Create your account',
                  desc: 'Sign up for free in seconds. No credit card required.',
                },
                {
                  step: '02',
                  title: 'Save your first bookmark',
                  desc: 'Paste any URL to save and organize it with tags and collections.',
                },
                {
                  step: '03',
                  title: 'Explore & connect',
                  desc: 'Follow others, discover trending links, and build your feed.',
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to tame your browser tabs?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of curious people who use LinkSpace to build their personal knowledge base.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="gap-2 px-10">
                  Get started — it&apos;s free
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <BookmarkIcon className="h-4 w-4 text-primary" />
              LinkSpace
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} LinkSpace. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
