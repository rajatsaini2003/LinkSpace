'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
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
  Search,
  Tag,
  Shield,
  Layers,
  Share2,
  ChevronDown,
  Star,
  Clock,
  MousePointerClick,
  Monitor,
  Smartphone,
  Chrome,
  Github,
  Twitter,
  Mail,
  CheckCircle2,
  ArrowUpRight,
  Quote,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ═══════════════════════════════════════════════════════
   ANIMATED HEADING
   ═══════════════════════════════════════════════════════ */
function AnimatedHeading() {
  const words = ['Collect.', 'Share.', 'Discover.']
  return (
    <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tight leading-[1.05]">
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

/* ═══════════════════════════════════════════════════════
   FLOATING MOCK CARDS
   ═══════════════════════════════════════════════════════ */
const mockCards = [
  { title: 'The Future of Web Dev', domain: 'dev.to', color: 'from-orange-500/20 to-amber-500/10', rotate: '-6deg', x: '5%', y: '20%', delay: 0.6 },
  { title: 'Understanding React 19', domain: 'react.dev', color: 'from-sky-500/20 to-blue-500/10', rotate: '4deg', x: '68%', y: '15%', delay: 0.9 },
  { title: 'AI Productivity Hacks', domain: 'medium.com', color: 'from-emerald-500/20 to-teal-500/10', rotate: '-3deg', x: '75%', y: '55%', delay: 1.2 },
  { title: 'System Design Guide', domain: 'github.com', color: 'from-purple-500/20 to-violet-500/10', rotate: '7deg', x: '-5%', y: '60%', delay: 1.0 },
  { title: 'TypeScript Best Practices', domain: 'typescriptlang.org', color: 'from-blue-500/20 to-indigo-500/10', rotate: '-2deg', x: '35%', y: '70%', delay: 1.4 },
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
            transition={{ duration: 5 + i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
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

/* ═══════════════════════════════════════════════════════
   GRADIENT ORBS
   ═══════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════
   TRUSTED BY / SOCIAL PROOF MARQUEE
   ═══════════════════════════════════════════════════════ */
const trustedByLogos = [
  'Google', 'Stripe', 'Vercel', 'GitHub', 'Notion', 'Figma', 'Linear', 'Slack',
]

function TrustedBySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <section ref={ref} className="py-16 px-6 border-b border-border/30">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p className="text-center text-xs font-semibold text-muted-foreground/60 tracking-[0.2em] uppercase mb-8">
          Trusted by teams at
        </p>
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee gap-12 items-center justify-center">
            {[...trustedByLogos, ...trustedByLogos].map((name, i) => (
              <div
                key={i}
                className="flex-shrink-0 px-4 py-2 text-lg font-bold text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors select-none"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   HOW IT WORKS
   ═══════════════════════════════════════════════════════ */
const steps = [
  {
    step: '01',
    icon: MousePointerClick,
    title: 'Save Any Link',
    desc: 'One click to save any URL. Use our browser extension, mobile app, or paste it directly. We auto-fetch titles, thumbnails, and metadata.',
    color: 'from-orange-500 to-amber-500',
  },
  {
    step: '02',
    icon: Layers,
    title: 'Organize & Tag',
    desc: 'Create collections, add tags, and let AI auto-categorize your links. Build your personal knowledge library effortlessly.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    step: '03',
    icon: Share2,
    title: 'Share & Discover',
    desc: 'Share collections with the world or keep them private. Discover trending links and follow curators with great taste.',
    color: 'from-violet-500 to-purple-500',
  },
]

function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            How it works
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Three steps to a
            <br />
            <span className="text-gradient">better web experience.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-[2px] bg-gradient-to-r from-orange-500/20 via-blue-500/20 to-violet-500/20" />

          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              className="relative text-center"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div className={`relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-6 shadow-lg`}>
                <s.icon className="w-7 h-7 text-white" />
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs font-bold text-foreground">
                  {s.step}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   FEATURES SECTION (enhanced)
   ═══════════════════════════════════════════════════════ */
const features = [
  { icon: FolderOpen, title: 'Smart Collections', desc: 'Organize links into curated collections. Public or private — your call.', color: 'bg-orange-500/10 text-orange-500' },
  { icon: Users, title: 'Social Discovery', desc: 'Follow people with great taste. See what the community is saving.', color: 'bg-blue-500/10 text-blue-500' },
  { icon: TrendingUp, title: 'Trending Feed', desc: 'Never miss the hottest links. Trending algorithm surfaces the best.', color: 'bg-emerald-500/10 text-emerald-500' },
  { icon: Sparkles, title: 'AI Summaries', desc: 'Instantly summarize any page and get smart tag suggestions.', color: 'bg-violet-500/10 text-violet-500' },
  { icon: MessageCircle, title: 'Comments & Likes', desc: 'Engage with bookmarks. Discuss, react, and build connections.', color: 'bg-pink-500/10 text-pink-500' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Built for speed. Tag, search, and filter in milliseconds.', color: 'bg-amber-500/10 text-amber-500' },
  { icon: Search, title: 'Powerful Search', desc: 'Full-text search across all your saved links, tags, and collections.', color: 'bg-cyan-500/10 text-cyan-500' },
  { icon: Shield, title: 'Privacy First', desc: 'Your data belongs to you. End-to-end encryption for private collections.', color: 'bg-green-500/10 text-green-500' },
  { icon: Tag, title: 'Smart Tags', desc: 'AI auto-tags your links. Create custom taxonomies and filters.', color: 'bg-indigo-500/10 text-indigo-500' },
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
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed for modern web curators. From AI-powered organization
            to real-time collaboration — we&apos;ve got you covered.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="group relative rounded-2xl border bg-card/50 p-6 hover:bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-5 h-5" />
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

/* ═══════════════════════════════════════════════════════
   FEATURE SPOTLIGHT (alternating left/right)
   ═══════════════════════════════════════════════════════ */
const spotlights = [
  {
    badge: 'Smart Organization',
    title: 'Your links, beautifully organized.',
    desc: 'Create nested collections, drag-and-drop to reorder, and let our AI suggest the perfect structure. No more messy bookmark bars.',
    features: ['Nested collections', 'Drag-and-drop ordering', 'AI-suggested structure', 'Bulk import & export'],
    gradient: 'from-orange-500/10 to-amber-500/5',
    accentColor: 'text-orange-500',
    mockUI: 'collections',
  },
  {
    badge: 'Social Feed',
    title: 'Discover what the internet is reading.',
    desc: 'A curated feed of trending links from the community. Follow curators, explore topics, and never miss what matters.',
    features: ['Personalized feed', 'Topic-based discovery', 'Curator profiles', 'Trending algorithm'],
    gradient: 'from-blue-500/10 to-cyan-500/5',
    accentColor: 'text-blue-500',
    mockUI: 'feed',
  },
  {
    badge: 'AI-Powered',
    title: 'Summaries, tags, and insights — instantly.',
    desc: 'Our AI reads every link you save and provides concise summaries, auto-generated tags, and related link suggestions.',
    features: ['One-click summaries', 'Auto-tagging', 'Related suggestions', 'Key takeaways extraction'],
    gradient: 'from-violet-500/10 to-purple-500/5',
    accentColor: 'text-violet-500',
    mockUI: 'ai',
  },
]

function MockCollectionsUI() {
  return (
    <div className="rounded-2xl border bg-card/80 backdrop-blur p-5 shadow-2xl shadow-black/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500/60" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <div className="w-3 h-3 rounded-full bg-green-500/60" />
        <div className="flex-1 mx-4 h-7 rounded-lg bg-muted/50 flex items-center px-3">
          <Search className="w-3 h-3 text-muted-foreground/40 mr-2" />
          <span className="text-xs text-muted-foreground/40">Search collections...</span>
        </div>
      </div>
      {['Design Inspiration', 'Dev Resources', 'AI & ML Papers'].map((name, i) => (
        <div key={name} className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 ? 'bg-primary/5 border border-primary/10' : 'hover:bg-muted/30'} mb-1 transition-colors`}>
          <div className={`w-8 h-8 rounded-lg ${i === 0 ? 'bg-orange-500/20' : i === 1 ? 'bg-blue-500/20' : 'bg-violet-500/20'} flex items-center justify-center`}>
            <FolderOpen className={`w-4 h-4 ${i === 0 ? 'text-orange-500' : i === 1 ? 'text-blue-500' : 'text-violet-500'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{name}</p>
            <p className="text-[11px] text-muted-foreground">{24 - i * 6} links</p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{i === 0 ? 'Public' : 'Private'}</span>
        </div>
      ))}
    </div>
  )
}

function MockFeedUI() {
  return (
    <div className="rounded-2xl border bg-card/80 backdrop-blur p-5 shadow-2xl shadow-black/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {['Trending', 'Following', 'Topics'].map((tab, i) => (
            <span key={tab} className={`text-xs px-3 py-1.5 rounded-full ${i === 0 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'} font-medium transition-colors`}>
              {tab}
            </span>
          ))}
        </div>
      </div>
      {[
        { title: 'Why SQLite is the future', author: 'Sarah K.', likes: 234, tag: 'Database' },
        { title: 'The Art of Code Review', author: 'Mike T.', likes: 189, tag: 'Engineering' },
      ].map((item, i) => (
        <div key={i} className="p-3 rounded-xl hover:bg-muted/30 mb-1 transition-colors">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {item.author[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-snug">{item.title}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[11px] text-muted-foreground">{item.author}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{item.tag}</span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Heart className="w-3 h-3" /> {item.likes}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MessageCircle className="w-3 h-3" /> {Math.floor(item.likes / 5)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function MockAIUI() {
  return (
    <div className="rounded-2xl border bg-card/80 backdrop-blur p-5 shadow-2xl shadow-black/10">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-violet-500" />
        </div>
        <div>
          <p className="text-sm font-semibold">AI Summary</p>
          <p className="text-[11px] text-muted-foreground">Generated in 1.2s</p>
        </div>
      </div>
      <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/10 mb-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          This article explores how modern web frameworks are converging on similar patterns:
          server components, streaming, and edge computing. The author argues that the future
          is hybrid rendering...
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {['Web Dev', 'React', 'Next.js', 'SSR', 'Edge'].map(tag => (
          <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-3 h-3 text-muted-foreground/50" />
        <span className="text-[11px] text-muted-foreground">5 min read</span>
      </div>
    </div>
  )
}

function FeatureSpotlightSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const mockUIs: Record<string, React.ReactNode> = {
    collections: <MockCollectionsUI />,
    feed: <MockFeedUI />,
    ai: <MockAIUI />,
  }

  return (
    <section ref={ref} className="py-32 px-6">
      <div className="max-w-6xl mx-auto space-y-32">
        {spotlights.map((s, i) => (
          <motion.div
            key={s.title}
            className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-16 items-center`}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: i * 0.15 }}
          >
            {/* Text */}
            <div className="flex-1 space-y-6">
              <span className={`inline-block text-xs font-semibold ${s.accentColor} tracking-widest uppercase px-3 py-1 rounded-full bg-current/10`}>
                {s.badge}
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
                {s.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              <ul className="grid grid-cols-2 gap-3 pt-2">
                {s.features.map(feat => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mock UI */}
            <div className={`flex-1 w-full max-w-md rounded-3xl bg-gradient-to-br ${s.gradient} p-6 sm:p-8`}>
              {mockUIs[s.mockUI]}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   STATS SECTION (enhanced)
   ═══════════════════════════════════════════════════════ */
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
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <CountUp target={value} />
          {suffix}
        </motion.span>
      )}
    </motion.span>
  )
}

function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const stats = [
    { value: 50000, suffix: '+', label: 'Bookmarks Saved', icon: Bookmark },
    { value: 12000, suffix: '+', label: 'Active Users', icon: Users },
    { value: 3500, suffix: '+', label: 'Collections Created', icon: FolderOpen },
    { value: 98, suffix: '%', label: 'Uptime SLA', icon: Zap },
  ]

  return (
    <section ref={ref} className="relative py-28 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            By the numbers
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Growing every day
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center p-6 rounded-2xl border bg-card/30 hover:bg-card/60 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <AnimatedNumber value={s.value} suffix={s.suffix} />
              <p className="text-sm text-muted-foreground mt-2 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   TESTIMONIALS
   ═══════════════════════════════════════════════════════ */
const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer at Figma',
    avatar: 'SC',
    text: 'LinkSpace completely changed how I save design inspiration. The AI summaries alone save me hours every week.',
    stars: 5,
  },
  {
    name: 'Alex Rivera',
    role: 'Senior Engineer at Stripe',
    avatar: 'AR',
    text: 'Finally, a bookmarking tool that understands developers. The collections feature is incredibly powerful and the search is instant.',
    stars: 5,
  },
  {
    name: 'Emily Watson',
    role: 'Content Strategist',
    avatar: 'EW',
    text: 'I manage hundreds of research links and LinkSpace makes it effortless. The social discovery feature surfaces gems I&apos;d never find alone.',
    stars: 5,
  },
  {
    name: 'Marcus Kim',
    role: 'Founder at Launchpad',
    avatar: 'MK',
    text: 'Our entire team uses LinkSpace for shared research. The collaborative collections are a game-changer for remote teams.',
    stars: 5,
  },
  {
    name: 'Priya Patel',
    role: 'Data Scientist',
    avatar: 'PP',
    text: 'The trending feed surfaces papers and articles I actually care about. Way better than any algorithm I&apos;ve seen on social media.',
    stars: 5,
  },
  {
    name: 'James Morrison',
    role: 'Tech Lead at Vercel',
    avatar: 'JM',
    text: 'Clean design, blazing fast performance, and thoughtful features. LinkSpace is what browser bookmarks should have been all along.',
    stars: 5,
  },
]

function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Loved by curators
            <br />
            <span className="text-muted-foreground">around the world.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="group relative rounded-2xl border bg-card/50 p-6 hover:bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Quote className="w-8 h-8 text-primary/10 mb-3" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{t.text}</p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PLATFORM / BROWSER EXTENSION
   ═══════════════════════════════════════════════════════ */
function PlatformSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const platforms = [
    { icon: Chrome, name: 'Chrome Extension', desc: 'Save links with one click from your browser' },
    { icon: Monitor, name: 'Web App', desc: 'Full-featured dashboard on any device' },
    { icon: Smartphone, name: 'Mobile Ready', desc: 'Responsive design works on any screen' },
  ]

  return (
    <section ref={ref} className="py-28 px-6 border-t border-border/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            Available everywhere
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Save from anywhere.
            <br />
            <span className="text-muted-foreground">Access everywhere.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {platforms.map((p, i) => (
            <motion.div
              key={p.name}
              className="relative text-center p-8 rounded-2xl border bg-card/30 hover:bg-card/60 transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <p.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   FAQ SECTION
   ═══════════════════════════════════════════════════════ */
const faqs = [
  { q: 'Is LinkSpace free to use?', a: 'Yes! LinkSpace is completely free for individual use. Save unlimited links, create collections, and discover content at no cost. We also offer a Pro plan with advanced features like AI summaries and team collaboration.' },
  { q: 'How is this different from browser bookmarks?', a: 'Browser bookmarks are static and siloed. LinkSpace adds social discovery, AI-powered summaries, smart tags, full-text search, collections, and a beautiful interface. Plus, your links sync across all your devices.' },
  { q: 'Can I import my existing bookmarks?', a: 'Absolutely! LinkSpace supports one-click import from Chrome, Firefox, Safari, Pocket, Raindrop, and many other services. Your bookmarks are automatically organized using our AI.' },
  { q: 'Is my data private?', a: 'Your privacy is our priority. All private collections are encrypted, and you have full control over what\'s shared publicly. We never sell your data to third parties.' },
  { q: 'Can I collaborate with my team?', a: 'Yes! Create shared collections, invite team members, and collaborate in real-time. Perfect for research teams, design teams, and content teams who curate links together.' },
  { q: 'What platforms are supported?', a: 'LinkSpace works on all modern browsers through our web app. We also offer a Chrome extension for one-click saving, and our responsive design works beautifully on mobile devices.' },
]

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className="border-b border-border/50 last:border-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-semibold text-sm sm:text-base pr-4 group-hover:text-primary transition-colors">{faq.q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-muted-foreground leading-relaxed pb-5 pr-8">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FAQSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Questions? <span className="text-muted-foreground">Answers.</span>
          </h2>
        </motion.div>

        <div className="rounded-2xl border bg-card/50 p-6 sm:p-8">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   CTA SECTION (enhanced)
   ═══════════════════════════════════════════════════════ */
function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-32 px-6">
      <motion.div
        className="max-w-4xl mx-auto relative"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <div className="relative rounded-3xl overflow-hidden border bg-card/50 p-12 sm:p-16 text-center">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/[0.08] blur-[80px]" />
            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[300px] h-[300px] rounded-full bg-violet-500/[0.05] blur-[60px]" />
          </div>

          <div className="relative">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-card/60 backdrop-blur text-sm text-muted-foreground mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Free forever for individuals
            </motion.div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
              Ready to start
              <br />
              <span className="text-gradient">curating?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join thousands of curators who use LinkSpace to save, organize,
              and share the best of the web. It takes 30 seconds to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild className="text-base px-10 h-14 rounded-full shadow-lg shadow-primary/25">
                <Link href="/signup">
                  Create Free Account <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8 h-14 rounded-full">
                <Link href="/feed">
                  Explore Feed <ArrowUpRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground/60 mt-6">
              No credit card required &bull; Free forever &bull; Cancel anytime
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   LANDING NAVBAR (enhanced)
   ═══════════════════════════════════════════════════════ */
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

        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
          <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          <Link href="/feed" className="hover:text-foreground transition-colors">Feed</Link>
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

/* ═══════════════════════════════════════════════════════
   FOOTER (enhanced multi-column)
   ═══════════════════════════════════════════════════════ */
const footerLinks = {
  Product: [
    { name: 'Features', href: '#features' },
    { name: 'Feed', href: '/feed' },
    { name: 'Collections', href: '/signup' },
    { name: 'AI Summaries', href: '/signup' },
  ],
  Resources: [
    { name: 'Documentation', href: '#' },
    { name: 'API Reference', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Changelog', href: '#' },
  ],
  Company: [
    { name: 'About', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Contact', href: '#' },
  ],
}

function Footer() {
  return (
    <footer className="border-t pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 font-bold text-lg mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Bookmark className="w-4 h-4 text-primary-foreground" />
              </div>
              LinkSpace
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
              The social bookmarking platform for people who curate the web. Save, organize, and discover what matters.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4 text-muted-foreground" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4 text-muted-foreground" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors" aria-label="Email">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.name}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60">
          <p>&copy; {new Date().getFullYear()} LinkSpace. All rights reserved.</p>
          <p>Built with purpose. Designed with care.</p>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */
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

          {/* Micro social proof under CTA */}
          <motion.div
            className="mt-8 flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <div className="flex -space-x-2">
              {['SC', 'AR', 'EW', 'MK'].map((initials, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-background bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center text-[9px] font-bold text-primary"
                >
                  {initials}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              Loved by <strong className="text-foreground">12,000+</strong> curators
            </span>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Trusted By ── */}
      <TrustedBySection />

      {/* ── How it Works ── */}
      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      {/* ── Features ── */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* ── Feature Spotlights ── */}
      <FeatureSpotlightSection />

      {/* ── Stats ── */}
      <StatsSection />

      {/* ── Testimonials ── */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>

      {/* ── Platform ── */}
      <PlatformSection />

      {/* ── FAQ ── */}
      <div id="faq">
        <FAQSection />
      </div>

      {/* ── CTA ── */}
      <CTASection />

      {/* ── Footer ── */}
      <Footer />
    </div>
  )
}
