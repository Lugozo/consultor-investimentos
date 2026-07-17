'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function GerarCarteiraButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGerar = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/carteiras', { method: 'POST' })
      const data = await res.json()
      if (data.carteira_id) {
        router.push(`/carteira/${data.carteira_id}`)
      }
    } catch {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleGerar} disabled={loading}>
      {loading ? 'Gerando...' : 'Gerar Minha Carteira'}
    </Button>
  )
}
