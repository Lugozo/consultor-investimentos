'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: '\u{1F4CA}' },
  { href: '/carteira', label: 'Carteiras', icon: '\u{1F4BC}' },
  { href: '/ativos', label: 'Ativos', icon: '\u{1F50D}' },
  { href: '/metas', label: 'Metas', icon: '\u{1F3AF}' },
  { href: '/config', label: 'Configurações', icon: '⚙️' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  const navLinks = (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {links.map(link => {
        const active = pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={close}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? 'bg-teal-50 text-teal-800'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        )
      })}
    </nav>
  )

  const sidebarContent = (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <span className="text-xl font-bold text-teal-700">Investo</span>
        {/* Close button — mobile only */}
        <button
          onClick={close}
          className="lg:hidden text-slate-500 hover:text-slate-700 text-xl leading-none"
          aria-label="Fechar menu"
        >
          ✕
        </button>
      </div>

      {navLinks}

      <div className="border-t border-slate-100 p-4">
        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        <Button variant="ghost" size="sm" onClick={signOut} className="mt-2 w-full">
          Sair
        </Button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={close}
            aria-hidden
          />
          {/* Slide-in sidebar */}
          <div className="absolute left-0 top-0 h-full animate-[slideIn_200ms_ease-out]">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Hamburger button — mobile only */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 rounded-lg border border-slate-200 bg-white p-2 shadow-sm hover:bg-slate-50"
        aria-label="Abrir menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>
    </>
  )
}
