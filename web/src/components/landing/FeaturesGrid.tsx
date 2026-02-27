'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  FolderOpen,
  Users,
  TrendingUp,
  Sparkles,
  MessageCircle,
  Zap,
  Search,
  Shield,
  Tag,
} from 'lucide-react'

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

export default function FeaturesSection() {
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
