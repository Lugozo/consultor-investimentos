'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

export function CadastroForm() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
        <div className="relative">
          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[34px] text-xs text-slate-400 hover:text-slate-600"
            tabIndex={-1}
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Conta'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Já tem conta?{' '}
        <Link href="/login" className="text-teal-700 hover:underline">
          Entrar
        </Link>
      </p>
    </Card>
  )
}
