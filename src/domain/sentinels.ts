import type { Cidadao, Familia, MedicaoPressaoArterial } from './types'
import { idadeAnosCompletos, idadeMesesCompletos } from '../lib/idade'

/**
 * Tabela de sentinelas (critérios de vulnerabilidade) e pontuações.
 *
 * Regras do projeto:
 *  1. NENHUM ponto é escrito manualmente nos dados mockados: cada sentinela é
 *     avaliada a partir dos dados fictícios do cidadão/domicílio.
 *  2. Cada regra tem UMA única definição. O mesmo predicado (`condicao`) é
 *     usado para avaliar a família inteira e para exibir as condições no cartão
 *     do cidadão, evitando divergência entre cálculo e interface.
 *  3. Uma sentinela identificada por qualquer membro pontua o domicílio uma
 *     única vez: a metodologia considera a presença do critério no domicílio,
 *     e não a quantidade de pessoas.
 *
 * Para criar novas sentinelas ou alterar pontuações, edite apenas
 * `PONTOS_PADRAO`, `FAIXAS_MORADOR_COMODO` e `DEFINICOES_SENTINELAS`.
 */

export type SentinelId =
  | 'ACAMADO'
  | 'DEFICIENCIA_FISICA'
  | 'DEFICIENCIA_MENTAL'
  | 'SANEAMENTO_BAIXO'
  | 'DESNUTRICAO_GRAVE'
  | 'DROGADICAO'
  | 'DESEMPREGO'
  | 'ANALFABETISMO'
  | 'MENOR_SEIS_MESES'
  | 'MAIOR_SETENTA_ANOS'
  | 'HIPERTENSAO_ARTERIAL'
  | 'DIABETES_MELLITUS'
  | 'RELACAO_MORADOR_COMODO'

/** Pontuação de cada sentinela, exatamente como recebida na metodologia. */
export const PONTOS_PADRAO: Record<SentinelId, number> = {
  ACAMADO: 3,
  DEFICIENCIA_FISICA: 3,
  DEFICIENCIA_MENTAL: 3,
  SANEAMENTO_BAIXO: 3,
  DESNUTRICAO_GRAVE: 3,
  DROGADICAO: 2,
  DESEMPREGO: 2,
  ANALFABETISMO: 1,
  MENOR_SEIS_MESES: 1,
  MAIOR_SETENTA_ANOS: 1,
  HIPERTENSAO_ARTERIAL: 1,
  DIABETES_MELLITUS: 1,
  // A relação morador/cômodo tem pontuação por faixa (ver FAIXAS_MORADOR_COMODO).
  // O valor abaixo é a pontuação máxima da faixa "maior que 1".
  RELACAO_MORADOR_COMODO: 3,
}

/** Faixas da relação morador/cômodo (numeroMoradores / numeroComodos). */
export const FAIXAS_MORADOR_COMODO = [
  { descricao: 'maior que 1', pontos: 3 },
  { descricao: 'igual a 1', pontos: 2 },
  { descricao: 'menor que 1', pontos: 0 },
] as const

/**
 * Idade a partir da qual a pessoa é considerada em idade escolar para fins de
 * analfabetismo. A metodologia diz apenas "a partir da idade escolar", sem fixar
 * o valor: o protótipo adota 6 anos.
 * QUESTÃO EM ABERTO — ajustar conforme a versão oficial da metodologia.
 */
export const IDADE_ESCOLAR_MINIMA_ANOS = 6

/** Idade máxima para avaliação da desnutrição grave, conforme a metodologia. */
export const IDADE_MAXIMA_DESNUTRICAO_ANOS = 7

/** Idade máxima (em meses completos) do lactente da sentinela "menores de 6 meses". */
export const IDADE_MAXIMA_LACTENTE_MESES = 5

/** Idade mínima (em anos completos) da sentinela "maiores de 70 anos". */
export const IDADE_MINIMA_IDOSO_ANOS = 70
/** Limiares de pressão arterial (mmHg) informados na definição da sentinela. */
export const LIMIAR_PRESSAO_SISTOLICA = 140
export const LIMIAR_PRESSAO_DIASTOLICA = 90

export interface AvaliacaoSentinela {
  id: SentinelId
  nome: string
  definicao: string
  escopo: EscopoSentinela
  /** Pontuação atribuída quando a sentinela é identificada (0 caso contrário). */
  pontos: number
  identificada: boolean
  /** Ids dos membros relacionados com a sentinela (vazio em critérios do domicílio). */
  membrosRelacionados: string[]
  /** Explicação curta do porquê a sentinela foi (ou não) identificada. */
  explicacao: string
}

export type EscopoSentinela = 'cidadao' | 'domicilio'

export interface ContextoAvaliacao {
  familia: Familia
  /** Relação morador/cômodo já calculada (0 quando não há cômodos registrados). */
  relacaoMoradorComodo: number
}

interface BaseDefinicao {
  id: SentinelId
  nome: string
  definicao: string
  escopo: EscopoSentinela
  avaliar: (contexto: ContextoAvaliacao) => ResultadoAvaliacao
}

interface DefinicaoCidadao extends BaseDefinicao {
  escopo: 'cidadao'
  /** Predicado único da regra, aplicado a cada morador do domicílio. */
  condicao: (cidadao: Cidadao) => boolean
  /** Rótulo amigável exibido no cartão do cidadão. */
  rotuloCidadao: string
}

interface DefinicaoDomicilio extends BaseDefinicao {
  escopo: 'domicilio'
}

export type DefinicaoSentinela = DefinicaoCidadao | DefinicaoDomicilio

interface ResultadoAvaliacao {
  identificada: boolean
  pontos: number
  membrosRelacionados: string[]
  explicacao: string
}

function nomes(membros: Cidadao[]): string {
  return membros.map((membro) => membro.nome).join(', ')
}

function naoIdentificado(explicacao: string): ResultadoAvaliacao {
  return { identificada: false, pontos: 0, membrosRelacionados: [], explicacao }
}

/**
 * Cria a definição de uma sentinela de escopo "cidadão".
 * A mesma condição é reutilizada na interface, garantindo que o cartão do
 * cidadão e o cálculo da família nunca divirjam.
 */
function sentinelaDeCidadao(config: {
  id: SentinelId
  nome: string
  rotuloCidadao: string
  definicao: string
  condicao: (cidadao: Cidadao) => boolean
  semEvidencia: string
  comEvidencia: (membros: Cidadao[]) => string
}): DefinicaoCidadao {
  return {
    id: config.id,
    nome: config.nome,
    definicao: config.definicao,
    escopo: 'cidadao',
    condicao: config.condicao,
    rotuloCidadao: config.rotuloCidadao,
    avaliar: (contexto) => {
      const membros = contexto.familia.membros.filter(config.condicao)

      if (membros.length === 0) {
        return naoIdentificado(config.semEvidencia)
      }

      return {
        identificada: true,
        pontos: PONTOS_PADRAO[config.id],
        membrosRelacionados: membros.map((membro) => membro.id),
        explicacao: config.comEvidencia(membros),
      }
    },
  }
}

/**
 * Regra da sentinela de hipertensão, aplicada literalmente conforme a
 * definição recebida: sistólica >= 140 mmHg e diastólica >= 90 mmHg, em
 * indivíduos que NÃO usam medicação anti-hipertensiva.
 * QUESTÃO EM ABERTO — se a versão oficial da metodologia também considerar
 * usuários de medicação, a alteração é feita apenas neste predicado.
 */
export function pressaoAtendeSentinela(pressao: MedicaoPressaoArterial | null): boolean {
  if (!pressao) return false

  return (
    pressao.sistolica >= LIMIAR_PRESSAO_SISTOLICA &&
    pressao.diastolica >= LIMIAR_PRESSAO_DIASTOLICA &&
    !pressao.usaMedicacaoAntiHipertensiva
  )
}

export const DEFINICOES_SENTINELAS: DefinicaoSentinela[] = [
  sentinelaDeCidadao({
    id: 'ACAMADO',
    nome: 'Acamado',
    rotuloCidadao: 'Restrita ao domicílio',
    definicao:
      'Pessoa restrita ao seu domicílio por falta de habilidade e/ou incapacidade de locomoção por si só a qualquer unidade de saúde.',
    condicao: (cidadao) => cidadao.restricaoDomiciliar,
    semEvidencia: 'Nenhum morador registrado como restrito ao domicílio.',
    comEvidencia: (membros) => `Restrição ao domicílio registrada para: ${nomes(membros)}.`,
  }),
  sentinelaDeCidadao({
    id: 'DEFICIENCIA_FISICA',
    nome: 'Deficiência física',
    rotuloCidadao: 'Deficiência física',
    definicao:
      'Defeito ou condição física de longa duração ou permanente que dificulta ou impede a realização de determinadas atividades cotidianas, escolares, de trabalho ou lazer.',
    condicao: (cidadao) => cidadao.deficienciaFisica,
    semEvidencia: 'Nenhum morador com deficiência física registrada.',
    comEvidencia: (membros) => `Deficiência física registrada para: ${nomes(membros)}.`,
  }),
  sentinelaDeCidadao({
    id: 'DEFICIENCIA_MENTAL',
    nome: 'Deficiência mental',
    rotuloCidadao: 'Deficiência mental',
    definicao:
      'Defeito ou condição mental de longa duração ou permanente que dificulta ou impede a realização de determinadas atividades cotidianas, escolares, de trabalho ou lazer.',
    condicao: (cidadao) => cidadao.deficienciaMental,
    semEvidencia: 'Nenhum morador com deficiência mental registrada.',
    comEvidencia: (membros) => `Deficiência mental registrada para: ${nomes(membros)}.`,
  }),
  {
    id: 'SANEAMENTO_BAIXO',
    nome: 'Baixas condições de saneamento',
    definicao:
      'Presença de pelo menos um dos seguintes fatores: lixo a céu aberto, água sem tratamento ou esgoto a céu aberto.',
    escopo: 'domicilio',
    avaliar: (contexto) => {
      const { domicilio } = contexto.familia
      const fatores: string[] = []
      if (domicilio.lixoACeuAberto) fatores.push('lixo a céu aberto')
      if (domicilio.aguaSemTratamento) fatores.push('água sem tratamento')
      if (domicilio.esgotoACeuAberto) fatores.push('esgoto a céu aberto')

      if (fatores.length === 0) {
        return naoIdentificado('Nenhum fator de saneamento inadequado registrado no domicílio.')
      }

      // A metodologia considera suficiente um único fator para identificar a sentinela.
      return {
        identificada: true,
        pontos: PONTOS_PADRAO.SANEAMENTO_BAIXO,
        membrosRelacionados: [],
        explicacao: `Domicílio com ${fatores.join(', ')}. A presença de qualquer um dos fatores já identifica a sentinela.`,
      }
    },
  },
  sentinelaDeCidadao({
    id: 'DESNUTRICAO_GRAVE',
    nome: 'Desnutrição grave',
    rotuloCidadao: 'Desnutrição grave',
    definicao: `Condição de desnutrição grave avaliada pela metodologia em menores de ${IDADE_MAXIMA_DESNUTRICAO_ANOS} anos.`,
    // A metodologia não define o critério antropométrico: considera-se a condição
    // já registrada no cadastro fictício, limitada à faixa etária informada.
    condicao: (cidadao) =>
      cidadao.desnutricaoGrave &&
      idadeAnosCompletos(cidadao.dataNascimento) < IDADE_MAXIMA_DESNUTRICAO_ANOS,
    semEvidencia: `Nenhuma criança menor de ${IDADE_MAXIMA_DESNUTRICAO_ANOS} anos com desnutrição grave registrada.`,
    comEvidencia: (membros) => `Desnutrição grave registrada em: ${nomes(membros)}.`,
  }),
  sentinelaDeCidadao({
    id: 'DROGADICAO',
    nome: 'Drogadição',
    rotuloCidadao: 'Uso de substâncias',
    definicao:
      'Utilização compulsiva de drogas lícitas ou ilícitas com potencial para causar dependência química (álcool, tabaco, benzodiazepínicos, barbitúricos, drogas ilícitas).',
    condicao: (cidadao) => cidadao.drogadicao,
    semEvidencia: 'Nenhum morador com uso de substâncias registrado.',
    comEvidencia: (membros) => `Uso de substâncias registrado para: ${nomes(membros)}.`,
  }),
  sentinelaDeCidadao({
    id: 'DESEMPREGO',
    nome: 'Desemprego',
    rotuloCidadao: 'Sem ocupação',
    definicao:
      'Pessoa que não esteja exercendo nenhuma ocupação. Não são computados férias, licenças e afastamentos temporários; tarefas domésticas são consideradas ocupação.',
    condicao: (cidadao) => cidadao.situacaoOcupacional === 'desempregado',
    semEvidencia:
      'Todos os moradores com idade para o trabalho exercem alguma ocupação (tarefas domésticas também contam como ocupação).',
    comEvidencia: (membros) => `Sem ocupação registrada para: ${nomes(membros)}.`,
  }),
  sentinelaDeCidadao({
    id: 'ANALFABETISMO',
    nome: 'Analfabetismo',
    rotuloCidadao: 'Analfabeto',
    definicao:
      'Pessoa que, a partir da idade escolar, não sabe ler nem escrever no mínimo um bilhete e/ou sabe apenas assinar o nome.',
    condicao: (cidadao) =>
      cidadao.alfabetizacao === 'analfabeto' &&
      idadeAnosCompletos(cidadao.dataNascimento) >= IDADE_ESCOLAR_MINIMA_ANOS,
    semEvidencia: `Nenhum morador em idade escolar (a partir de ${IDADE_ESCOLAR_MINIMA_ANOS} anos) registrado como analfabeto.`,
    comEvidencia: (membros) => `Analfabetismo registrado para: ${nomes(membros)}.`,
  }),
  sentinelaDeCidadao({
    id: 'MENOR_SEIS_MESES',
    nome: 'Menores de 6 meses',
    rotuloCidadao: 'Menor de 6 meses',
    definicao: 'Lactente com idade até 5 meses e 29 dias.',
    condicao: (cidadao) => idadeMesesCompletos(cidadao.dataNascimento) <= IDADE_MAXIMA_LACTENTE_MESES,
    semEvidencia: 'Nenhum lactente com até 5 meses e 29 dias no domicílio.',
    comEvidencia: (membros) => `Lactente(s) de até 6 meses no domicílio: ${nomes(membros)}.`,
  }),
  sentinelaDeCidadao({
    id: 'MAIOR_SETENTA_ANOS',
    nome: 'Maiores de 70 anos',
    rotuloCidadao: 'Maior de 70 anos',
    definicao: 'Pessoa com mais de 70 anos completos.',
    // Leitura adotada: a pessoa precisa ter completado 71 anos ou mais, ou seja,
    // 70 anos por extenso ainda não pontua.
    // QUESTÃO EM ABERTO — se a intenção for incluir quem já passou dos 70 anos
    // (por exemplo, 70 anos e 1 dia), a alteração é feita nesta comparação.
    condicao: (cidadao) => idadeAnosCompletos(cidadao.dataNascimento) > IDADE_MINIMA_IDOSO_ANOS,
    semEvidencia: 'Nenhum morador com mais de 70 anos completos.',
    comEvidencia: (membros) => `Moradores com mais de 70 anos completos: ${nomes(membros)}.`,
  }),
  sentinelaDeCidadao({
    id: 'HIPERTENSAO_ARTERIAL',
    nome: 'Hipertensão arterial',
    rotuloCidadao: 'Pressão arterial elevada',
    definicao: `Pressão arterial sistólica maior ou igual a ${LIMIAR_PRESSAO_SISTOLICA} mmHg e diastólica maior ou igual a ${LIMIAR_PRESSAO_DIASTOLICA} mmHg, em indivíduos que não usam medicação anti-hipertensiva.`,
    condicao: (cidadao) => pressaoAtendeSentinela(cidadao.pressaoArterial),
    semEvidencia: 'Nenhuma medição de pressão arterial dentro dos parâmetros da sentinela.',
    comEvidencia: (membros) =>
      `Pressão arterial acima do limiar em: ${membros
        .map((m) => `${m.nome} (${m.pressaoArterial!.sistolica}x${m.pressaoArterial!.diastolica} mmHg)`)
        .join(', ')}.`,
  }),
  sentinelaDeCidadao({
    id: 'DIABETES_MELLITUS',
    nome: 'Diabetes mellitus',
    rotuloCidadao: 'Diabetes mellitus',
    definicao:
      'Grupo de doenças metabólicas caracterizadas por hiperglicemia e associadas a complicações, disfunções e insuficiência de vários órgãos.',
    // A metodologia descreve o grupo de doenças sem critério operacional:
    // considera-se o registro do diagnóstico no cadastro fictício.
    condicao: (cidadao) => cidadao.diabetes,
    semEvidencia: 'Nenhum morador com diabetes mellitus registrada.',
    comEvidencia: (membros) => `Diabetes mellitus registrado para: ${nomes(membros)}.`,
  }),
  {
    id: 'RELACAO_MORADOR_COMODO',
    nome: 'Relação morador/cômodo',
    definicao:
      'Relação entre o número de moradores e o número de cômodos do domicílio (contando os compartimentos separados por paredes, incluindo banheiro e cozinha). Não são computados corredores, alpendres, varandas abertas, garagens e depósitos.',
    escopo: 'domicilio',
    avaliar: (contexto) => {
      const { numeroMoradores, numeroComodos } = contexto.familia.domicilio

      if (numeroComodos <= 0) {
        return naoIdentificado(
          'Número de cômodos não informado no cadastro fictício: relação não calculável.',
        )
      }

      const relacao = contexto.relacaoMoradorComodo
      const faixa = relacao > 1 ? FAIXAS_MORADOR_COMODO[0] : relacao === 1 ? FAIXAS_MORADOR_COMODO[1] : FAIXAS_MORADOR_COMODO[2]

      return {
        identificada: faixa.pontos > 0,
        pontos: faixa.pontos,
        membrosRelacionados: [],
        explicacao: `Relação morador/cômodo de ${relacao.toFixed(2).replace('.', ',')} (${numeroMoradores} moradores / ${numeroComodos} cômodos): faixa ${faixa.descricao} vale ${faixa.pontos} pontos.`,
      }
    },
  },
]

/** Ordem de exibição: ordem oficial da tabela de sentinelas. */
export const ORDEM_SENTINELAS: SentinelId[] = DEFINICOES_SENTINELAS.map((d) => d.id)

/** Definições cujo critério é avaliado nos moradores do domicílio. */
export const DEFINICOES_SENTINELA_CIDADAO: DefinicaoCidadao[] = DEFINICOES_SENTINELAS.filter(
  (definicao): definicao is DefinicaoCidadao => definicao.escopo === 'cidadao',
)

export interface CondicaoCidadao {
  id: SentinelId
  rotulo: string
  ativa: boolean
  pontos: number
}

/**
 * Condições do cidadão avaliadas a partir dos mesmos predicados usados no
 * cálculo da família. Garante que a interface e o cálculo nunca divirjam.
 */
export function condicoesDoCidadao(cidadao: Cidadao): CondicaoCidadao[] {
  return DEFINICOES_SENTINELA_CIDADAO.map((definicao) => ({
    id: definicao.id,
    rotulo: definicao.rotuloCidadao,
    ativa: definicao.condicao(cidadao),
    pontos: PONTOS_PADRAO[definicao.id],
  }))
}

export function nomeSentinela(id: SentinelId): string {
  return DEFINICOES_SENTINELAS.find((definicao) => definicao.id === id)?.nome ?? id
}
