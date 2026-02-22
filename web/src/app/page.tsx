'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import {
  Bookmark,
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp,
  FolderOpen,
  MessageCircle,
  Zap,
  Globe,
  Heart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─── Animated Word Reveal ────
function AnimatedHeading() {
  const words = ['Collect.', 'Share.', 'Discover.']
  return (
    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05]">
      {words.map((word, i) => (
        <motion.span
          key={word}
          className="inline-block mr-3 sm:mr-5"
          initial={{ y: 80, opacity: 0, rotateX: 40 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.15 + i * 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {i === 2 ? <span className="text-gradient">{word}</span> : word}
        </motion.span>
      ))}
    </h1>
  )
}

// ─── Floating Mock Cards ────
const mockCards = [
  {
    title: 'The Future of Web Dev',
    domain: 'dev.to',
    color: 'from-orange-500/20 to-amber-500/10',
    rotate: '-6deg',
    x: '5%',
    y: '20%',
    delay: 0.6,
  },
  {
    title: 'Understanding React 19',
    domain: 'react.dev',
    color: 'from-sky-500/20 to-blue-500/10',
    rotate: '4deg',
    x: '68%',
    y: '15%',
    delay: 0.9,
  },
  {
    title: 'AI Productivity Hacks',
    domain: 'medium.com',
    color: 'from-emerald-500/20 to-teal-500/10',
    rotate: '-3deg',
    x: '75%',
    y: '55%',
    delay: 1.2,
  },
  {
    title: 'System Design Guide',
    domain: 'github.com',
    color: 'from-purple-500/20 to-violet-500/10',
    rotate: '7deg',
    x: '-5%',
    y: '60%',
    delay: 1.0,
  },
  {
    title: 'TypeScript Best Practices',
    domain: 'typescriptlang.org',
    color: 'from-blue-500/20 to-indigo-500/10',
    rotate: '-2deg',
    x: '35%',
    y: '70%',
    delay: 1.4,
  },
]

function FloatingCards() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {mockCards.map((card, i) => (
        <motion.div
          key={i}
          className={`absolute w-56 sm:w-64 rounded-2xl glass p-4 bg-gradient-to-br ${card.color}`}
          style={{ left: card.x, top: card.y, rotate: card.rotate }}
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 0.7, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: card.delay, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 5 + i * 0.7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
                <Globe className="w-3.5 h-3.5 text-white/60" />
              </div>
              <span className="text-[11px] text-white/40 font-medium">{card.domain}</span>
            </div>
            <p className="text-sm font-semibold text-white/70 leading-snug">{card.title}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="flex items-center gap-1 text-[10px] text-white/30">
                <Heart className="w-3 h-3" /> {12 + i * 7}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-white/30">
                <MessageCircle className="w-3 h-3" /> {3 + i * 2}
              </span>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Gradient Orbs ────
function GradientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute -top-[40%] -right-[20%] w-[800px] h-[800px] rounded-full bg-orange-500/[0.07] blur-[120px]"
        animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-[30%] -left-[15%] w-[600px] h-[600px] rounded-full bg-teal-500/[0.05] blur-[100px]"
        animate={{ x: [0, -20, 30, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[20%] left-[50%] w-[400px] h-[400px] rounded-full bg-violet-500/[0.04] blur-[80px]"
        animate={{ x: [0, 40, -30, 0], y: [0, -30, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

// ─── Features ────
const features = [
  {
    icon: FolderOpen,
    title: 'Smart Collections',
    desc: 'Organize links into curated collections. Public or private — your call.',
  },
  {
    icon: Users,
    title: 'Social Discovery',
    desc: 'Follow people with great taste. See what the community is saving.',
  },
  {
    icon: TrendingUp,
    title: 'Trending Feed',
    desc: 'Never miss the hottest links. Trending algorithm surfaces the best.',
  },
  {
    icon: Sparkles,
    title: 'AI Summaries',
    desc: 'Instantly summarize any page and get smart tag suggestions.',
  },
  {
    icon: MessageCircle,
    title: 'Comments & Likes',
    desc: 'Engage with bookmarks. Discuss, react, and build connections.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Built for speed. Tag, search, and filter in milliseconds.',
  },
]

function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Everything you need,
            <br />
            <span className="text-muted-foreground">nothing you don&apos;t.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="group relative rounded-2xl border bg-card/50 p-6 hover:bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Stats ────
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.span
      ref={ref}
      className="text-4xl sm:text-5xl font-extrabold text-gradient"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      {isInView && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <CountUp target={value} />
          {suffix}
        </motion.span>
      )}
    </motion.span>
  )
}

function CountUp({ target }: { target: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(nodeRef, { once: true })

  return (
    <motion.span
      ref={nodeRef}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
      onAnimationStart={() => {
        if (!inView || !nodeRef.current) return
        let start = 0
        const duration = 2000
        const startTime = performance.now()
        const step = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          const val = Math.floor(eased * target)
          if (nodeRef.current) nodeRef.current.textContent = val.toLocaleString()
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }}
    />
  )
}

function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const stats = [
    { value: 50000, suffix: '+', label: 'Bookmarks Saved' },
    { value: 12000, suffix: '+', label: 'Active Users' },
    { value: 3500, suffix: '+', label: 'Collections' },
  ]

  return (
    <section ref={ref} className="py-24 px-6 border-t border-b border-border/50">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <AnimatedNumber value={s.value} suffix={s.suffix} />
              <p className="text-sm text-muted-foreground mt-2 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA ────
function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-32 px-6">
      <motion.div
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          Ready to start curating?
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
          Join thousands who use LinkSpace to save, organize, and share the best of the web.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" asChild className="text-base px-8 h-12 rounded-full">
            <Link href="/signup">
              Create Free Account <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-base px-8 h-12 rounded-full">
            <Link href="/feed">Browse Trending</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}

// ─── Landing Navbar ────
function LandingNav() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Bookmark className="w-4 h-4 text-primary-foreground" />
          </div>
          LinkSpace
        </Link>

        <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <Link href="/feed" className="hover:text-foreground transition-colors">
            Feed
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild className="rounded-full px-5">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </nav>
    </motion.header>
  )
}

// ─── Footer ────
function Footer() {
  return (
    <footer className="border-t py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Bookmark className="w-3 h-3 text-primary-foreground" />
          </div>
          LinkSpace
        </div>
        <p>&copy; {new Date().getFullYear()} LinkSpace. Built with purpose.</p>
      </div>
    </footer>
  )
}

// ─── PAGE ────
export default function LandingPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.96])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <LandingNav />

      {/* ── Hero ── */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-6 pt-16"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <GradientOrbs />
        <div className="dot-pattern absolute inset-0 opacity-30" />
        <FloatingCards />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-card/60 backdrop-blur text-sm text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>
              Now with <strong className="text-foreground">AI-powered summaries</strong>
            </span>
          </motion.div>

          <AnimatedHeading />

          <motion.p
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            The social bookmarking platform for people who curate the web.
            Save links, build collections, and discover what matters.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <Button size="lg" asChild className="text-base px-8 h-12 rounded-full shadow-lg shadow-primary/25">
              <Link href="/signup">
                Start for Free <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-8 h-12 rounded-full">
              <Link href="/feed">Explore Feed</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Sections ── */}
      <div id="features">
        <FeaturesSection />
      </div>
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
