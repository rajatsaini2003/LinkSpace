'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

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
    text: "I manage hundreds of research links and LinkSpace makes it effortless. The social discovery feature surfaces gems I'd never find alone.",
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
    text: "The trending feed surfaces papers and articles I actually care about. Way better than any algorithm I've seen on social media.",
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

export default function TestimonialsSection() {
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
