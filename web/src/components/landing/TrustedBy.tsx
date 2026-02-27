'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const trustedByLogos = [
  'Google', 'Stripe', 'Vercel', 'GitHub', 'Notion', 'Figma', 'Linear', 'Slack',
]

export default function TrustedBySection() {
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
