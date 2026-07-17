'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/components/providers/theme-provider'
import { Button } from '@/components/ui/button'

const icons: Record<string, React.ReactNode> = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  carteira: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  ativos: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  metas: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9V1"/><path d="m15 4-3-3-3 3"/></svg>,
  config: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
}

const links = [
  { href: '/dashboard', label: 'Dashboard', iconKey: 'dashboard' as const },
  { href: '/carteira', label: 'Carteiras', iconKey: 'carteira' as const },
  { href: '/watchlist', label: 'Watchlist', iconKey: 'metas' as const },
  { href: '/ativos', label: 'Ativos', iconKey: 'ativos' as const },
  { href: '/metas', label: 'Metas', iconKey: 'metas' as const },
  { href: '/config', label: 'Configurações', iconKey: 'config' as const },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  const navLinks = (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {links.map(link => {
        const active = pathname.startsWith(link.href)
        const icon = icons[link.iconKey]
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={close}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? 'bg-teal-50 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span aria-hidden="true">{icon}</span>
            {link.label}
          </Link>
        )
      })}
    </nav>
  )

  const sidebarContent = (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700">
        <span className="text-xl font-bold text-teal-700">Investo</span>
        {/* Close button — mobile only */}
        <button
          onClick={close}
          className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xl leading-none"
          aria-label="Fechar menu"
        >
          ✕
        </button>
      </div>

      {/* Theme toggle */}
      <div className="px-3 py-2">
        <button
          onClick={toggle}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors w-full"
          aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
          {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
        </button>
      </div>

      {navLinks}

      <div className="border-t border-slate-100 dark:border-slate-700 p-4">
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
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
        className="lg:hidden fixed top-4 left-4 z-40 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
        aria-label="Abrir menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>
    </>
  )
}
