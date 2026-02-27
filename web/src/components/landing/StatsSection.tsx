'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Bookmark, Users, FolderOpen, Zap } from 'lucide-react'

/* ── CountUp animation utility ── */
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

/* ── Stats Section ── */
const stats = [
  { value: 50000, suffix: '+', label: 'Bookmarks Saved', icon: Bookmark },
  { value: 12000, suffix: '+', label: 'Active Users', icon: Users },
  { value: 3500, suffix: '+', label: 'Collections Created', icon: FolderOpen },
  { value: 98, suffix: '%', label: 'Uptime SLA', icon: Zap },
]

export default function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative py-28 px-6 overflow-hidden">
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
