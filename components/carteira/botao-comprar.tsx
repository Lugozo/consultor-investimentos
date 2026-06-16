'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { CorretoraLink } from '@/lib/api/corretoras'

export function BotaoComprar({ ticker, classe }: { ticker: string; classe: string }) {
  const [corretoras, setCorretoras] = useState<CorretoraLink[]>([])
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    fetch(`/api/corretoras?classe=${classe}`)
      .then(r => r.json())
      .then(setCorretoras)
  }, [classe])

  if (corretoras.length === 0) return null

  return (
    <div className="relative">
      <Button size="sm" variant="outline" onClick={() => setAberto(!aberto)}>
        Comprar via →
      </Button>
      {aberto && (
        <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[180px]">
          {corretoras.map(c => {
            const url = c.url_base.replace('{TICKER}', ticker)
              + (c.afiliado_id ? `?ref=${c.afiliado_id}` : '')
            return (
              <a
                key={c.id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                onClick={() => setAberto(false)}
              >
                {c.corretora}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
