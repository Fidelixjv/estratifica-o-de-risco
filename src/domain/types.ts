/**
 * Tipos do domínio do protótipo.
 *
 * Todos os registros aqui representados são FICTÍCIOS. Nomes, datas de nascimento,
 * identificadores e condições de saúde foram criados exclusivamente para a
 * demonstração acadêmica e não correspondem a pessoas ou domicílios reais.
 *
 * Em uma implementação real, estes dados seriam obtidos do Prontuário
 * Eletrônico do Cidadão (PEC). Neste protótipo não existe integração com o
 * PEC: os dados vêm de arquivos mockados em `src/data`.
 */

export type Sexo = 'F' | 'M' | 'Outro'

/**
 * Situação ocupacional registrada no cadastro fictício.
 *
 * Observação metodológica: a sentinela DESEMPREGO considera apenas quem não
 * exerce nenhuma ocupação, não computando férias, licenças ou afastamentos
 * temporários. Tarefas domésticas são consideradas ocupação, por isso
 * `naoRemunerado` NÃO gera pontos.
 */
export type SituacaoOcupacional = 'ocupado' | 'naoRemunerado' | 'desempregado'

/** Alfabetização registrada no cadastro fictício. */
export type Alfabetizacao = 'alfabetizado' | 'analfabeto'

/** Medição de pressão arterial registrada no acompanhamento fictício. */
export interface MedicaoPressaoArterial {
  sistolica: number
  diastolica: number
  usaMedicacaoAntiHipertensiva: boolean
  data: string
}

/** Cidadão (membro da família) vinculado a um domicílio. Dados fictícios. */
export interface Cidadao {
  id: string
  /** Identificação fictícia no formato "Pessoa 01". Nunca um nome real. */
  nome: string
  /** Data de nascimento fictícia no formato ISO (AAAA-MM-DD). */
  dataNascimento: string
  sexo: Sexo
  situacaoOcupacional: SituacaoOcupacional
  alfabetizacao: Alfabetizacao
  /**
   * Base da sentinela ACAMADO: pessoa restrita ao próprio domicílio por falta
   * de habilidade e/ou incapacidade de locomoção por si só a uma unidade de saúde.
   */
  restricaoDomiciliar: boolean
  deficienciaFisica: boolean
  deficienciaMental: boolean
  /** Avaliada pela metodologia apenas para menores de 7 anos. */
  desnutricaoGrave: boolean
  /** Uso de álcool, tabaco, benzodiazepínicos, barbitúricos ou drogas ilícitas. */
  drogadicao: boolean
  diabetes: boolean
  pressaoArterial: MedicaoPressaoArterial | null
  /** Situações identificadas, em linguagem simplificada (texto fictício). */
  situacoes: string[]
}

/** Informações do domicílio necessárias ao cálculo. Dados fictícios. */
export interface Domicilio {
  id: string
  identificacao: string
  /** Referência de localização inteiramente fictícia. */
  localizacaoFicticia: string
  numeroMoradores: number
  /** Compartimentos do domicílio, incluindo cozinha e banheiro quando separados por paredes. */
  numeroComodos: number
  lixoACeuAberto: boolean
  aguaSemTratamento: boolean
  esgotoACeuAberto: boolean
}

/** Família (moradores + domicílio) analisável pelo protótipo. */
export interface Familia {
  id: string
  identificacao: string
  situacao: string
  /** Data fictícia da última análise realizada pelo protótipo (ISO). */
  ultimaAnalise: string
  membros: Cidadao[]
  domicilio: Domicilio
}
