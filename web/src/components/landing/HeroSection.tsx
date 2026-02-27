'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Bookmark,
  ArrowRight,
  Sparkles,
  Globe,
  Heart,
  MessageCircle,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ── Animated Heading ── */
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

/* ── Floating Mock Cards ── */
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

/* ── Gradient Orbs ── */
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

/* ── Hero Section (exported) ── */
export default function HeroSection() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.96])

  return (
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

        {/* Micro social proof */}
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
  )
}
