import { describe, it, expect } from 'vitest'
import { calcularScoreRisco, classificarPerfil } from '@/lib/algorithms/score-risco'
import type { QuestionarioRespostas } from '@/types'

const baseRespostas: QuestionarioRespostas = {
  idade: 30,
  renda_mensal: '5000_10000',
  patrimonio: '50000_100000',
  objetivo: 'crescimento',
  horizonte: 'longo',
  experiencia_nivel: 3,
  tolerancia_risco: 'manteria',
  pct_investimento: 30,
  tem_reserva: true,
  pref_simplicidade: 3,
}

describe('calcularScoreRisco', () => {
  it('retorna score baixo para perfil conservador', () => {
    const respostas: QuestionarioRespostas = {
      ...baseRespostas,
      idade: 65,
      horizonte: 'curto',
      tolerancia_risco: 'venderia_tudo',
      experiencia_nivel: 1,
    }
    const score = calcularScoreRisco(respostas)
    expect(score).toBeLessThanOrEqual(30)
  })

  it('retorna score alto para perfil agressivo', () => {
    const respostas: QuestionarioRespostas = {
      ...baseRespostas,
      idade: 25,
      horizonte: 'muito_longo',
      tolerancia_risco: 'compraria_mais',
      experiencia_nivel: 5,
    }
    const score = calcularScoreRisco(respostas)
    expect(score).toBeGreaterThanOrEqual(61)
  })

  it('retorna score moderado para perfil equilibrado', () => {
    const score = calcularScoreRisco(baseRespostas)
    expect(score).toBeGreaterThanOrEqual(31)
    expect(score).toBeLessThanOrEqual(60)
  })

  it('score está entre 0 e 100', () => {
    const score = calcularScoreRisco(baseRespostas)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('idade maior reduz o score', () => {
    const jovem = calcularScoreRisco({ ...baseRespostas, idade: 20 })
    const idoso = calcularScoreRisco({ ...baseRespostas, idade: 70 })
    expect(jovem).toBeGreaterThan(idoso)
  })
})

describe('classificarPerfil', () => {
  it('classifica score 0-30 como conservador', () => {
    expect(classificarPerfil(0)).toBe('conservador')
    expect(classificarPerfil(15)).toBe('conservador')
    expect(classificarPerfil(30)).toBe('conservador')
  })

  it('classifica score 31-60 como moderado', () => {
    expect(classificarPerfil(31)).toBe('moderado')
    expect(classificarPerfil(45)).toBe('moderado')
    expect(classificarPerfil(60)).toBe('moderado')
  })

  it('classifica score 61-100 como agressivo', () => {
    expect(classificarPerfil(61)).toBe('agressivo')
    expect(classificarPerfil(80)).toBe('agressivo')
    expect(classificarPerfil(100)).toBe('agressivo')
  })
})
