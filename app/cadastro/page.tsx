import { CadastroForm } from '@/components/auth/cadastro-form'

export default function CadastroPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-teal-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-teal-700 tracking-tight">Investo</span>
          <p className="text-sm text-slate-500 mt-1">Crie sua conta gratuita</p>
        </div>
        <CadastroForm />
      </div>
    </div>
  )
}
