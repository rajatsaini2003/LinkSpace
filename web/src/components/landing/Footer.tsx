'use client'

import Link from 'next/link'
import { Bookmark, Twitter, Github, Mail } from 'lucide-react'

const footerLinks = {
  Product: [
    { name: 'Features', href: '#features' },
    { name: 'Feed', href: '/feed' },
    { name: 'Collections', href: '/signup' },
    { name: 'AI Summaries', href: '/signup' },
  ],
  Resources: [
    { name: 'Documentation', href: '#' },
    { name: 'API Reference', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Changelog', href: '#' },
  ],
  Company: [
    { name: 'About', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Contact', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Bookmark className="w-4 h-4 text-primary-foreground" />
              </div>
              LinkSpace
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
              The social bookmarking platform for people who curate the web. Save, organize, and discover what matters.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4 text-muted-foreground" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4 text-muted-foreground" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors" aria-label="Email">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.name}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60">
          <p>&copy; {new Date().getFullYear()} LinkSpace. All rights reserved.</p>
          <p>Built with purpose. Designed with care.</p>
        </div>
      </div>
    </footer>
  )
}
