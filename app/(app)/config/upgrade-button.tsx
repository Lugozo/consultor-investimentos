'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function UpgradeButton() {
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
    <Button onClick={handleUpgrade} disabled={loading} size="sm">
      {loading ? 'Aguarde...' : 'Fazer Upgrade'}
    </Button>
  )
}
