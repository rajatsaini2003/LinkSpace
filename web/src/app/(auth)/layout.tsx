export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="dot-pattern fixed inset-0 opacity-20 pointer-events-none" />
      {children}
    </div>
  )
}
