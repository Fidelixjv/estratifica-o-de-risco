import { AlertTriangle, CheckCircle2, MinusCircle, type LucideIcon } from 'lucide-react'
import type { AvaliacaoSentinela } from '../../domain/sentinels'
import type { Familia } from '../../domain/types'

interface SentinelCardProps {
  sentinela: AvaliacaoSentinela
  familia: Familia
}

/** Nome da pessoa relacionada à sentinela. */
function rotuloMembros(sentinela: AvaliacaoSentinela, familia: Familia): string[] {
  return sentinela.membrosRelacionados
    .map((id) => familia.membros.find((membro) => membro.id === id)?.nome ?? id)
}

export function SentinelCard({ sentinela, familia }: SentinelCardProps) {
  const nomes = rotuloMembros(sentinela, familia)

  const Icone: LucideIcon = sentinela.identificada ? AlertTriangle : MinusCircle
  const rotuloStatus = sentinela.identificada ? 'Identificada' : 'Não identificada'

  return (
    <li
      className={[
        'rounded-xl border p-4',
        sentinela.identificada
          ? 'border-amber-200 bg-amber-50/70'
          : 'border-slate-200 bg-white',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <div className="flex min-w-0 items-start gap-2">
          <Icone
            aria-hidden="true"
            className={[
              'mt-0.5 size-5 shrink-0',
              sentinela.identificada ? 'text-amber-700' : 'text-slate-400',
            ].join(' ')}
          />
          <h4 className="text-sm font-semibold text-slate-800">{sentinela.nome}</h4>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={[
              'rounded-full px-2.5 py-0.5 text-xs font-semibold',
              sentinela.identificada
                ? 'bg-amber-100 text-amber-900'
                : 'bg-slate-100 text-slate-500',
            ].join(' ')}
          >
            {rotuloStatus}
          </span>
          <span
            className={[
              'rounded-full px-2.5 py-0.5 text-xs font-bold',
              sentinela.identificada
                ? 'bg-amber-700 text-white'
                : 'bg-slate-200 text-slate-600',
            ].join(' ')}
          >
            {sentinela.identificada
              ? `${sentinela.pontos} ${sentinela.pontos === 1 ? 'ponto' : 'pontos'}`
              : '0 pontos'}
          </span>
        </div>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-slate-600">{sentinela.explicacao}</p>

      {sentinela.identificada && nomes.length > 0 && (
        <p className="mt-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-700">Pessoa relacionada:</span>{' '}
          {nomes.join(', ')}
        </p>
      )}

      {sentinela.identificada && (
        <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-slate-500">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          <span>{sentinela.definicao}</span>
        </p>
      )}
    </li>
  )
}
