import { createServerSupabase } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { gerarAlocacao } from '@/lib/algorithms/alocacao'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ResultadoPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfis_investidor')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!perfil) redirect('/questionario')

  const alocacao = gerarAlocacao(perfil.perfil_final, perfil.objetivo)

  const classeLabels: Record<string, string> = {
    rf: 'Renda Fixa',
    acoes: 'Ações',
    fiis: 'Fundos Imobiliários',
    cripto: 'Criptomoedas',
    internacional: 'Internacional',
  }

  const perfilLabels: Record<string, string> = {
    conservador: 'Conservador',
    moderado: 'Moderado',
    agressivo: 'Agressivo',
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Seu Perfil de Investidor</h1>
      <p className="text-slate-500 mb-8">Com base nas suas respostas, traçamos seu perfil.</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Perfil: {perfilLabels[perfil.perfil_final]}</CardTitle>
        </CardHeader>
        <p className="text-sm text-slate-600">
          Score de Risco: <span className="font-bold">{perfil.score_risco}/100</span>
        </p>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Alocação Sugerida</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {Object.entries(alocacao).map(([classe, pct]) => (
            <div key={classe}>
              <div className="flex justify-between text-sm mb-1">
                <span>{classeLabels[classe] ?? classe}</span>
                <span className="font-medium">{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-teal-600"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-4">
        <Link href="/questionario">
          <Button variant="outline">Refazer Questionário</Button>
        </Link>
        <Link href="/dashboard">
          <Button>Ir para Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
