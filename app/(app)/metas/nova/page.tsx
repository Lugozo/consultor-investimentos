'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function NovaMetaPage() {
  const [nome, setNome] = useState('')
  const [valorAlvo, setValorAlvo] = useState('')
  const [dataAlvo, setDataAlvo] = useState('')
  const [aporteMensal, setAporteMensal] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!nome.trim() || !valorAlvo || !dataAlvo) {
      setError('Preencha nome, valor alvo e data alvo.')
      return
    }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Usuário não autenticado'); setLoading(false); return }

    const { error: insertErr } = await supabase.from('metas').insert({
      user_id: user.id,
      nome: nome.trim(),
      valor_alvo: Number(valorAlvo),
      data_alvo: dataAlvo,
      aporte_mensal_planejado: aporteMensal ? Number(aporteMensal) : 0,
    })

    if (insertErr) { setError(insertErr.message); setLoading(false); return }

    router.push('/metas')
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Nova Meta</h1>
      <p className="text-slate-500 mb-6">Defina sua meta financeira.</p>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Meta</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome da Meta"
            placeholder="Ex: Entrada do apartamento"
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
          <Input
            label="Valor Alvo (R$)"
            type="number"
            placeholder="Ex: 100000"
            value={valorAlvo}
            onChange={e => setValorAlvo(e.target.value)}
          />
          <Input
            label="Data Alvo"
            type="date"
            value={dataAlvo}
            onChange={e => setDataAlvo(e.target.value)}
          />
          <Input
            label="Aporte Mensal Planejado (R$)"
            type="number"
            placeholder="Ex: 2000"
            value={aporteMensal}
            onChange={e => setAporteMensal(e.target.value)}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-4 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Criar Meta'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/metas')}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
