import type { NivelRisco } from './classificacao'
import type { ResultadoEstratificacao } from './estratificacao'

/** Indicadores do dashboard, todos calculados a partir das análises. */

export interface ResumoRisco {
  totalFamilias: number
  totalCidadaos: number
  porNivel: Record<NivelRisco, number>
  naoClassificadas: number
  mediaPontuacao: number
  maiorPontuacao: number
}

export function resumirRisco(resultados: ResultadoEstratificacao[]): ResumoRisco {
  const porNivel: Record<NivelRisco, number> = { Habitual: 0, R1: 0, R2: 0, R3: 0 }
  let totalCidadaos = 0
  let somaPontuacoes = 0
  let maiorPontuacao = 0
  let naoClassificadas = 0

  for (const resultado of resultados) {
    totalCidadaos += resultado.totalMoradores
    somaPontuacoes += resultado.escoreTotal
    maiorPontuacao = Math.max(maiorPontuacao, resultado.escoreTotal)

    if (resultado.classificacao.nivel) {
      porNivel[resultado.classificacao.nivel] += 1
    } else {
      naoClassificadas += 1
    }
  }

  return {
    totalFamilias: resultados.length,
    totalCidadaos,
    porNivel,
    naoClassificadas,
    mediaPontuacao: resultados.length > 0 ? somaPontuacoes / resultados.length : 0,
    maiorPontuacao,
  }
}

/** Famílias ordenadas da maior para a menor pontuação (prioridade de atenção). */
export function familiasPorPrioridade(
  resultados: ResultadoEstratificacao[],
): ResultadoEstratificacao[] {
  return [...resultados].sort((a, b) => b.escoreTotal - a.escoreTotal)
}
