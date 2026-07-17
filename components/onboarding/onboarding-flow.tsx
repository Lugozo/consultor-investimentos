'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const passos = [
  {
    titulo: 'Bem-vindo ao Investo!',
    descricao: 'Seu consultor de investimentos pessoal. Vamos começar sua jornada financeira.',
    acao: 'Próximo',
    rota: null,
  },
  {
    titulo: 'Descubra seu Perfil',
    descricao: 'Responda 10 perguntas sobre seus objetivos, tolerância a risco e horizonte de investimento.',
    acao: 'Responder Questionário',
    rota: '/questionario',
  },
  {
    titulo: 'Sua Carteira Personalizada',
    descricao: 'Geramos uma carteira com ativos reais baseada no seu perfil. Ações, FIIs, cripto e renda fixa.',
    acao: 'Começar',
    rota: null,
  },
]

export function OnboardingFlow() {
  const [passo, setPasso] = useState(0)
  const [visivel, setVisivel] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Mostra onboarding se não foi completado
    const completed = localStorage.getItem('onboarding_complete')
    if (!completed) setVisivel(true)
  }, [])

  const avancar = () => {
    if (passo < passos.length - 1) {
      setPasso(passo + 1)
      if (passos[passo].rota) {
        router.push(passos[passo].rota!)
      }
    } else {
      localStorage.setItem('onboarding_complete', 'true')
      setVisivel(false)
    }
  }

  const pular = () => {
    localStorage.setItem('onboarding_complete', 'true')
    setVisivel(false)
  }

  if (!visivel) return null

  const p = passos[passo]

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 animate-[fadeIn_300ms_ease-out] text-center">
        {/* Indicador de passo */}
        <div className="flex justify-center gap-2 mb-6">
          {passos.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === passo ? 'w-6 bg-teal-600' : 'w-1.5 bg-slate-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{p.titulo}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{p.descricao}</p>

        <div className="flex gap-3 justify-center">
          <Button onClick={avancar}>{p.acao}</Button>
          <Button variant="ghost" onClick={pular}>Pular</Button>
        </div>
      </div>
    </div>
  )
}
