import { describe, it, expect } from 'vitest'
import { gerarAlocacao } from '@/lib/algorithms/alocacao'

describe('gerarAlocacao', () => {
  it('conservador concentra em renda fixa', () => {
    const alocacao = gerarAlocacao('conservador', 'crescimento')
    expect(alocacao.rf).toBeGreaterThanOrEqual(70)
  })

  it('agressivo tem mais acoes e cripto', () => {
    const alocacao = gerarAlocacao('agressivo', 'crescimento')
    expect(alocacao.acoes + alocacao.cripto).toBeGreaterThanOrEqual(40)
  })

  it('reserva de emergencia prioriza renda fixa', () => {
    const alocacao = gerarAlocacao('moderado', 'reserva_emergencia')
    expect(alocacao.rf).toBeGreaterThanOrEqual(90)
  })

  it('aposentadoria aumenta internacional', () => {
    const base = gerarAlocacao('moderado', 'crescimento')
    const aposent = gerarAlocacao('moderado', 'aposentadoria')
    expect(aposent.internacional).toBeGreaterThanOrEqual(base.internacional)
  })

  it('soma dos percentuais é 100%', () => {
    const alocacao = gerarAlocacao('moderado', 'imovel')
    const soma = alocacao.rf + alocacao.acoes + alocacao.fiis + alocacao.cripto + alocacao.internacional
    expect(soma).toBe(100)
  })

  it('renda extra aumenta fiis', () => {
    const base = gerarAlocacao('moderado', 'crescimento')
    const renda = gerarAlocacao('moderado', 'renda_extra')
    expect(renda.fiis).toBeGreaterThanOrEqual(base.fiis)
  })
})
