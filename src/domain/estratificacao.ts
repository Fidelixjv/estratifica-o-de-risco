import { classificarRisco, type ClassificacaoRisco } from './classificacao'
import {
  DEFINICOES_SENTINELAS,
  PONTOS_PADRAO,
  type AvaliacaoSentinela,
  type ContextoAvaliacao,
} from './sentinels'
import type { Familia } from './types'

/**
 * Motor de cálculo da Estratificação de Risco Familiar.
 *
 * Fluxo: dados do cidadão + dados do domicílio -> identificação das sentinelas
 * -> pontuação de cada sentinela -> soma -> classificação do risco.
 *
 * Nenhuma pontuação é digitada nos dados: tudo é derivado aqui.
 */

export interface RelacaoMoradorComodo {
  moradores: number
  comodos: number
  /** numeroMoradores / numeroComodos (null quando não há cômodos registrados). */
  proporcao: number | null
  proporcaoFormatada: string
  pontos: number
}

/** Rastreabilidade: de onde veio cada informação usada no cálculo. */
export interface DadosUtilizados {
  rotulo: string
  valores: string[]
}

export interface ResultadoEstratificacao {
  familia: Familia
  escoreTotal: number
  classificacao: ClassificacaoRisco
  /** Todas as sentinelas, na ordem oficial da tabela. */
  sentinelas: AvaliacaoSentinela[]
  /** Apenas as sentinelas identificadas, com os pontos que somaram. */
  sentinelasIdentificadas: AvaliacaoSentinela[]
  relacaoMoradorComodo: RelacaoMoradorComodo
  dadosUtilizados: DadosUtilizados[]
  /** Resumo por fonte de dados (membros x domicílio). */
  totalMoradores: number
}

function calcularRelacaoMoradorComodo(familia: Familia): RelacaoMoradorComodo {
  const { numeroMoradores, numeroComodos } = familia.domicilio
  const proporcao = numeroComodos > 0 ? numeroMoradores / numeroComodos : null
  const proporcaoFormatada = proporcao === null ? 'não calculável' : proporcao.toFixed(2).replace('.', ',')

  const pontos =
    proporcao === null
      ? 0
      : proporcao > 1
        ? PONTOS_PADRAO.RELACAO_MORADOR_COMODO
        : proporcao === 1
          ? 2
          : 0

  return { moradores: numeroMoradores, comodos: numeroComodos, proporcao, proporcaoFormatada, pontos }
}

function dadosUtilizados(familia: Familia, relacao: RelacaoMoradorComodo): DadosUtilizados[] {
  const { domicilio } = familia
  const sim = 'Sim'
  const nao = 'Não'

  return [
    {
      rotulo: 'Cadastro dos cidadãos (dados individuais)',
      valores: [
        `Moradores vinculados: ${familia.membros.length}`,
        `Data de nascimento, sexo, ocupação, alfabetização, restrições e condições de saúde registradas`,
      ],
    },
    {
      rotulo: 'Cadastro do domicílio',
      valores: [
        `Número de moradores: ${relacao.moradores}`,
        `Número de cômodos: ${relacao.comodos}`,
        `Relação morador/cômodo: ${relacao.proporcaoFormatada}`,
        `Lixo a céu aberto: ${domicilio.lixoACeuAberto ? sim : nao}`,
        `Água sem tratamento: ${domicilio.aguaSemTratamento ? sim : nao}`,
        `Esgoto a céu aberto: ${domicilio.esgotoACeuAberto ? sim : nao}`,
      ],
    },
  ]
}

/**
 * Calcula a Estratificação de Risco Familiar de uma família.
 * Função pura: apenas lê os dados recebidos e devolve o resultado.
 */
export function calcularRiscoFamilia(familia: Familia): ResultadoEstratificacao {
  const relacaoMoradorComodo = calcularRelacaoMoradorComodo(familia)
  const contexto: ContextoAvaliacao = { familia, relacaoMoradorComodo: relacaoMoradorComodo.proporcao ?? 0 }

  const sentinelas: AvaliacaoSentinela[] = DEFINICOES_SENTINELAS.map((definicao) => {
    const resultado = definicao.avaliar(contexto)

    return {
      id: definicao.id,
      nome: definicao.nome,
      definicao: definicao.definicao,
      escopo: definicao.escopo,
      pontos: resultado.identificada ? resultado.pontos : 0,
      identificada: resultado.identificada,
      membrosRelacionados: resultado.membrosRelacionados,
      explicacao: resultado.explicacao,
    }
  })

  const sentinelasIdentificadas = sentinelas.filter((sentinela) => sentinela.identificada)
  const escoreTotal = sentinelasIdentificadas.reduce((total, sentinela) => total + sentinela.pontos, 0)

  return {
    familia,
    escoreTotal,
    classificacao: classificarRisco(escoreTotal),
    sentinelas,
    sentinelasIdentificadas,
    relacaoMoradorComodo,
    dadosUtilizados: dadosUtilizados(familia, relacaoMoradorComodo),
    totalMoradores: familia.membros.length,
  }
}
