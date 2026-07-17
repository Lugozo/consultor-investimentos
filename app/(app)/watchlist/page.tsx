'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/providers/toast-provider'
import type { AtivoInfo } from '@/types'

export default function WatchlistPage() {
  const [ativos, setAtivos] = useState<{ ticker: string; nome: string; classe: string; id: string }[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/watchlist')
      .then(r => r.json())
      .then(data => setAtivos(Array.isArray(data) ? data : []))
      .catch(() => toast('Erro ao carregar watchlist', 'error'))
      .finally(() => setLoading(false))
  }, [toast])

  const remover = async (ticker: string) => {
    await fetch('/api/watchlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker }),
    })
    setAtivos(prev => prev.filter(a => a.ticker !== ticker))
    toast(`${ticker} removido da watchlist`, 'info')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Watchlist</h1>

      {loading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      ) : ativos.length === 0 ? (
        <EmptyState
          title="Watchlist vazia"
          description="Adicione ativos aos favoritos clicando na estrela nos cards de ativos da sua carteira."
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          }
        />
      ) : (
        <div className="grid gap-3">
          {ativos.map(a => (
            <Card key={a.id} className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{a.ticker}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                    {a.classe}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{a.nome}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => remover(a.ticker)}>
                ✕ Remover
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
