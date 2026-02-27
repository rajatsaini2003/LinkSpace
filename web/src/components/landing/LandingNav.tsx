'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingNav() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Bookmark className="w-4 h-4 text-primary-foreground" />
          </div>
          LinkSpace
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
          <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          <Link href="/feed" className="hover:text-foreground transition-colors">Feed</Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild className="rounded-full px-5">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </nav>
    </motion.header>
  )
}
