'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Chrome, Monitor, Smartphone } from 'lucide-react'

const platforms = [
  { icon: Chrome, name: 'Chrome Extension', desc: 'Save links with one click from your browser' },
  { icon: Monitor, name: 'Web App', desc: 'Full-featured dashboard on any device' },
  { icon: Smartphone, name: 'Mobile Ready', desc: 'Responsive design works on any screen' },
]

export default function PlatformSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

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
