import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LinkSpace – Save, Organize & Share Bookmarks',
  description:
    'LinkSpace is a social bookmarking platform where you can save, organize, and share links with the world.',
  keywords: ['bookmarks', 'social', 'links', 'collections', 'organize'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
