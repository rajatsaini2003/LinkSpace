'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Search,
  FolderOpen,
  Sparkles,
  Heart,
  MessageCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react'

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

const mockUIs: Record<string, React.ReactNode> = {
  collections: <MockCollectionsUI />,
  feed: <MockFeedUI />,
  ai: <MockAIUI />,
}

export default function FeatureSpotlightSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

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
            <div className={`flex-1 w-full max-w-md rounded-3xl bg-gradient-to-br ${s.gradient} p-6 sm:p-8`}>
              {mockUIs[s.mockUI]}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
