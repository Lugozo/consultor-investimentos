'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function UpgradeBanner({ featureName }: { featureName: string }) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-6 border-teal-200 bg-teal-50 text-center">
      <div className="flex items-center justify-center gap-2 mb-2 text-teal-800">
        <span className="text-xl">🔒</span>
        <h3 className="font-semibold">Recurso Premium</h3>
      </div>
      <p className="text-sm text-teal-700 mb-4">
        {featureName} está disponível apenas no plano Premium.
      </p>
      <Button onClick={handleUpgrade} disabled={loading} size="sm">
        {loading ? 'Redirecionando...' : 'Fazer Upgrade — R$ 19,90/mês'}
      </Button>
    </Card>
  )
}
