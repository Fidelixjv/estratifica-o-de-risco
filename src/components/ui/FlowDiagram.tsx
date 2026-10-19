import {
  ArrowDown,
  Calculator,
  Database,
  FileSearch,
  ListChecks,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

const ETAPAS: { titulo: string; descricao: string; icone: LucideIcon }[] = [
  {
    titulo: 'Cadastro do cidadão e do domicílio',
    descricao: 'Informações do cidadão e do domicílio.',
    icone: Database,
  },
  {
    titulo: 'Dados do cidadão + dados do domicílio',
    descricao: 'Cadastro dos moradores, condições de saúde e informações do domicílio.',
    icone: FileSearch,
  },
  {
    titulo: 'Identificação das sentinelas',
    descricao: 'Verificação automática dos critérios de vulnerabilidade.',
    icone: ListChecks,
  },
  {
    titulo: 'Cálculo da pontuação',
    descricao: 'Atribuição dos pontos de cada sentinela e soma do escore total.',
    icone: Calculator,
  },
  {
    titulo: 'Estratificação de risco',
    descricao: 'Classificação em risco habitual, R1, R2 ou R3.',
    icone: ShieldCheck,
  },
]

/** Fluxo visual da solução apresentada no dashboard. */
export function FlowDiagram() {
  return (
    <ol className="flex flex-col gap-1">
      {ETAPAS.map((etapa, indice) => (
        <li key={etapa.titulo}>
          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 ring-1 ring-slate-200"
            >
              <etapa.icone className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                <span className="text-brand-700">{indice + 1}.</span> {etapa.titulo}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{etapa.descricao}</p>
            </div>
          </div>
          {indice < ETAPAS.length - 1 && (
            <div className="flex justify-center py-1" aria-hidden="true">
              <ArrowDown className="size-4 text-brand-400" />
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}
