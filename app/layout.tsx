import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Investo — Consultor de Investimentos',
  description: 'Monte carteiras de investimento personalizadas com base no seu perfil',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased">
        {children}
      </body>
    </html>
  )
}
