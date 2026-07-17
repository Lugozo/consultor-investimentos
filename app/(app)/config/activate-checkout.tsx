'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'

export function ActivateCheckout({ sessionId }: { sessionId: string }) {
  const [status, setStatus] = useState<'verificando' | 'sucesso' | 'erro'>('verificando')

  useEffect(() => {
    fetch('/api/stripe/verify-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.status === 'active') {
          setStatus('sucesso')
          // Recarrega depois de 2s pra refletir o plano
          setTimeout(() => window.location.reload(), 2000)
        } else {
          setStatus('erro')
        }
      })
      .catch(() => setStatus('erro'))
  }, [sessionId])

  if (status === 'verificando') {
    return (
      <Card className="mb-6 border-teal-200 bg-teal-50">
        <p className="text-teal-800 text-sm">
          Verificando pagamento...
        </p>
      </Card>
    )
  }

  if (status === 'sucesso') {
    return (
      <Card className="mb-6 border-green-300 bg-green-50">
        <p className="text-green-800 text-sm">
          Pagamento confirmado! Plano Premium ativado. Recarregando...
        </p>
      </Card>
    )
  }

  return (
    <Card className="mb-6 border-red-300 bg-red-50">
      <p className="text-red-700 text-sm">
        Erro ao verificar pagamento. Recarregue a página ou entre em contato.
      </p>
    </Card>
  )
}
