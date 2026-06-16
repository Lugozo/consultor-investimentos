import { QuestionarioForm } from '@/components/questionario/questionario-form'

export default function QuestionarioPage() {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
        Descubra seu Perfil de Investidor
      </h1>
      <QuestionarioForm />
    </div>
  )
}
