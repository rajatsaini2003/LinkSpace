'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MousePointerClick, Layers, Share2 } from 'lucide-react'

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

export default function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden">
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
