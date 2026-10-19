/**
 * Classificação do risco familiar (Escore de Coelho-Savassi).
 *
 * Regras recebidas na tabela de requisitos:
 *
 *   0 a 4 pontos    -> Risco habitual
 *   5 ou 6 pontos   -> R1 – Risco menor
 *   7 ou 8 pontos   -> R2 – Risco médio
 *   9 pontos ou mais -> R3 – Risco máximo
 *
 * Escores negativos não possuem faixa definida e retornam
 * `{ nivel: null, descricao: 'Classificação não definida' }`.
 */

export type NivelRisco = 'Habitual' | 'R1' | 'R2' | 'R3'

export interface ClassificacaoRisco {
  nivel: NivelRisco | null
  descricao: string
}

export interface FaixaClassificacao {
  descricaoFaixa: string
  minimo: number
  maximo: number
  nivel: NivelRisco
  descricao: string
}

export const CLASSIFICACAO_NAO_DEFINIDA: ClassificacaoRisco = {
  nivel: null,
  descricao: 'Classificação não definida',
}

/** Ordem de exibição das faixas no material de apoio da interface. */
export const FAIXAS_CLASSIFICACAO: FaixaClassificacao[] = [
  {
    descricaoFaixa: '0 a 4 pontos',
    minimo: 0,
    maximo: 4,
    nivel: 'Habitual',
    descricao: 'Risco habitual',
  },
  {
    descricaoFaixa: '5 ou 6 pontos',
    minimo: 5,
    maximo: 6,
    nivel: 'R1',
    descricao: 'Risco menor',
  },
  {
    descricaoFaixa: '7 ou 8 pontos',
    minimo: 7,
    maximo: 8,
    nivel: 'R2',
    descricao: 'Risco médio',
  },
  {
    descricaoFaixa: '9 pontos ou mais',
    minimo: 9,
    maximo: Number.POSITIVE_INFINITY,
    nivel: 'R3',
    descricao: 'Risco máximo',
  },
]

/**
 * Classifica o risco familiar a partir do escore total.
 * Função pura: o mesmo escore sempre devolve a mesma classificação.
 */
export function classificarRisco(escoreTotal: number): ClassificacaoRisco {
  const faixa = FAIXAS_CLASSIFICACAO.find(
    (item) => escoreTotal >= item.minimo && escoreTotal <= item.maximo,
  )

  if (!faixa) {
    return CLASSIFICACAO_NAO_DEFINIDA
  }

  return { nivel: faixa.nivel, descricao: faixa.descricao }
}
