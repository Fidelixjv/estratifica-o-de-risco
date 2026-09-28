import { Link } from 'react-router-dom'
import { ArrowRight, Home, Users } from 'lucide-react'
import type { ResultadoEstratificacao } from '../../domain/estratificacao'
import { RiskBadge } from '../ui/RiskBadge'
import { pluralizar } from '../../lib/formatar'

interface FamilyCardProps {
  resultado: ResultadoEstratificacao
}

/** Cartão de família — usado em telas pequenas e nas listas do dashboard. */
export function FamilyCard({ resultado }: FamilyCardProps) {
  const { familia, escoreTotal, classificacao, sentinelasIdentificadas } = resultado
  const rotuloMoradores = pluralizar(
    familia.membros.length,
    'morador',
    'moradores',
  )

  return (
    <Link
      to={`/familias/${familia.id}`}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-400 hover:bg-brand-50/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-brand-700">{familia.id}</p>
          <p className="mt-0.5 truncate text-sm font-medium text-slate-800">
            {familia.domicilio.identificacao}
          </p>
        </div>
        <RiskBadge classificacao={classificacao} tamanho="sm" />
      </div>

      <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <Users aria-hidden="true" className="size-4 text-slate-400" />
          <dt className="sr-only">Moradores</dt>
          <dd>
            {familia.membros.length} {rotuloMoradores}
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Home aria-hidden="true" className="size-4 text-slate-400" />
          <dt className="sr-only">Cômodos</dt>
          <dd>
            {familia.domicilio.numeroComodos}{' '}
            {pluralizar(familia.domicilio.numeroComodos, 'cômodo', 'cômodos')}
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Pontuação</dt>
          <dd className="font-semibold text-slate-800">
            {escoreTotal} {pluralizar(escoreTotal, 'ponto', 'pontos')}
          </dd>
        </div>
      </dl>

      <p className="text-xs text-slate-500">
        {sentinelasIdentificadas.length}{' '}
        {pluralizar(sentinelasIdentificadas.length, 'sentinela identificada', 'sentinelas identificadas')}
      </p>

      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-800">
        Visualizar
        <ArrowRight aria-hidden="true" className="size-4" />
      </span>
    </Link>
  )
}
