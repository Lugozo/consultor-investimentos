'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: '\u{1F4CA}' },
  { href: '/carteira', label: 'Carteiras', icon: '\u{1F4BC}' },
  { href: '/ativos', label: 'Ativos', icon: '\u{1F50D}' },
  { href: '/metas', label: 'Metas', icon: '\u{1F3AF}' },
  { href: '/config', label: 'Configuracoes', icon: '\u{2699}\u{FE0F}' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-100">
        <span className="text-xl font-bold text-teal-700">Investo</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(link => {
          const active = pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
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

      <div className="border-t border-slate-100 p-4">
        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        <Button variant="ghost" size="sm" onClick={signOut} className="mt-2 w-full">
          Sair
        </Button>
      </div>
    </aside>
  )
}
