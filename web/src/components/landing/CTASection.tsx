'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Sparkles, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CTASection() {
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
