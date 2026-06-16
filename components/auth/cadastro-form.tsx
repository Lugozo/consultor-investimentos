'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

export function CadastroForm() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome } },
    })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    router.push('/questionario')
    router.refresh()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
      </CardHeader>
      <form onSubmit={handleCadastro} className="flex flex-col gap-4">
        <Input
          label="Nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Conta'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Já tem conta?{' '}
        <a href="/login" className="text-teal-700 hover:underline">
          Entrar
        </a>
      </p>
    </Card>
  )
}
