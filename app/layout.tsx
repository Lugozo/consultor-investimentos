import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Investo — Consultor de Investimentos',
  description: 'Monte carteiras de investimento personalizadas com base no seu perfil',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`min-h-screen bg-slate-50 text-slate-800 antialiased ${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
