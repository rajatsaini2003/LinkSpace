'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q: 'Is LinkSpace free to use?', a: 'Yes! LinkSpace is completely free for individual use. Save unlimited links, create collections, and discover content at no cost. We also offer a Pro plan with advanced features like AI summaries and team collaboration.' },
  { q: 'How is this different from browser bookmarks?', a: 'Browser bookmarks are static and siloed. LinkSpace adds social discovery, AI-powered summaries, smart tags, full-text search, collections, and a beautiful interface. Plus, your links sync across all your devices.' },
  { q: 'Can I import my existing bookmarks?', a: 'Absolutely! LinkSpace supports one-click import from Chrome, Firefox, Safari, Pocket, Raindrop, and many other services. Your bookmarks are automatically organized using our AI.' },
  { q: 'Is my data private?', a: "Your privacy is our priority. All private collections are encrypted, and you have full control over what's shared publicly. We never sell your data to third parties." },
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

export default function FAQSection() {
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
