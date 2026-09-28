import { Calculator, CircleDot } from 'lucide-react'
import type { ResultadoEstratificacao } from '../../domain/estratificacao'
import { RiskBadge } from '../ui/RiskBadge'
import { pluralizar } from '../../lib/formatar'

interface ScoreCardProps {
  resultado: ResultadoEstratificacao
}

/** Resultado da estratificação: pontuação total e classificação do risco. */
export function ScoreCard({ resultado }: ScoreCardProps) {
  const { escoreTotal, classificacao, sentinelasIdentificadas, familia } = resultado

  return (
    <section
      aria-labelledby="titulo-resultado"
      className="overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-sm"
    >
      <header className="flex items-center gap-3 border-b border-brand-100 bg-brand-50 px-4 py-3 sm:px-6">
        <Calculator aria-hidden="true" className="size-5 shrink-0 text-brand-700" />
        <h2 id="titulo-resultado" className="text-sm font-semibold text-brand-900 sm:text-base">
          Estratificação de risco familiar
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-4 px-4 py-5 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Família</p>
          <p className="mt-1 text-lg font-semibold text-slate-800">{familia.id}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{familia.situacao}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Pontuação total
          </p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-brand-800">
            {escoreTotal}
            <span className="ml-2 text-sm font-medium text-slate-500">
              {pluralizar(escoreTotal, 'ponto', 'pontos')}
            </span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {sentinelasIdentificadas.length}{' '}
            {pluralizar(
              sentinelasIdentificadas.length,
              'sentinela identificada',
              'sentinelas identificadas',
            )}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Classificação
          </p>
          <div className="mt-1.5">
            <RiskBadge classificacao={classificacao} />
          </div>
          {classificacao.nivel === null && (
            <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-slate-500">
              <CircleDot aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
              <span>
                Esta pontuação não possui faixa definida na metodologia apresentada, portanto o
                protótipo não classifica o risco.
              </span>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
