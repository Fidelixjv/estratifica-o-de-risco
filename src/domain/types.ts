export type Sexo = 'F' | 'M' | 'Outro'

/**
 * Situação ocupacional registrada no cadastro.
 *
 * Observação metodológica: a sentinela DESEMPREGO considera apenas quem não
 * exerce nenhuma ocupação, não computando férias, licenças ou afastamentos
 * temporários. Tarefas domésticas são consideradas ocupação, por isso
 * `naoRemunerado` NÃO gera pontos.
 */
export type SituacaoOcupacional = 'ocupado' | 'naoRemunerado' | 'desempregado'

/** Alfabetização registrada no cadastro. */
export type Alfabetizacao = 'alfabetizado' | 'analfabeto'

/** Medição de pressão arterial registrada no acompanhamento. */
export interface MedicaoPressaoArterial {
  sistolica: number
  diastolica: number
  usaMedicacaoAntiHipertensiva: boolean
  data: string
}

/** Cidadão (membro da família) vinculado a um domicílio. */
export interface Cidadao {
  id: string
  nome: string
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
  /** Situações identificadas, em linguagem simplificada. */
  situacoes: string[]
}

/** Informações do domicílio necessárias ao cálculo. */
export interface Domicilio {
  id: string
  identificacao: string
  /** Referência de localização do domicílio. */
  localizacaoFicticia: string
  numeroMoradores: number
  /** Compartimentos do domicílio, incluindo cozinha e banheiro quando separados por paredes. */
  numeroComodos: number
  lixoACeuAberto: boolean
  aguaSemTratamento: boolean
  esgotoACeuAberto: boolean
}

/** Família (moradores + domicílio) analisável pelo sistema. */
export interface Familia {
  id: string
  identificacao: string
  situacao: string
  /** Data da última análise realizada (ISO). */
  ultimaAnalise: string
  membros: Cidadao[]
  domicilio: Domicilio
}
