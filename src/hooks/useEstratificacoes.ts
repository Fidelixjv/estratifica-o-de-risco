import { useMemo } from 'react'
import { FAMILIAS_MOCK } from '../data/familiasMock'
import { calcularRiscoFamilia } from '../domain/estratificacao'
import { familiasPorPrioridade, resumirRisco } from '../domain/estatisticas'
import type { ResultadoEstratificacao } from '../domain/estratificacao'
import type { ResumoRisco } from '../domain/estatisticas'

/**
 * Análise de todas as famílias mockadas.
 *
 * O cálculo é feito uma única vez e memorizado. Em uma implementação real os
 * mesmos resultados viriam da leitura dos registros do PEC.
 */
export function useEstratificacoes(): ResultadoEstratificacao[] {
  return useMemo(() => FAMILIAS_MOCK.map(calcularRiscoFamilia), [])
}

export function useResumoRisco(): ResumoRisco {
  const resultados = useEstratificacoes()
  return useMemo(() => resumirRisco(resultados), [resultados])
}

export function useFamiliasPorPrioridade(): ResultadoEstratificacao[] {
  const resultados = useEstratificacoes()
  return useMemo(() => familiasPorPrioridade(resultados), [resultados])
}
