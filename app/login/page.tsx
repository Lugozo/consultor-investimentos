import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-teal-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-teal-700 tracking-tight">Investo</span>
          <p className="text-sm text-slate-500 mt-1">Seu consultor de investimentos</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
