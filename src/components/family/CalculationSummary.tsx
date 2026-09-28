import type { ResultadoEstratificacao } from '../../domain/estratificacao'
import { FAIXAS_CLASSIFICACAO } from '../../domain/classificacao'
import { RiskBadge } from '../ui/RiskBadge'
import { pluralizar } from '../../lib/formatar'

interface CalculationSummaryProps {
  resultado: ResultadoEstratificacao
}

/** Área "Como o resultado foi calculado?" — torna o processo transparente. */
export function CalculationSummary({ resultado }: CalculationSummaryProps) {
  const { dadosUtilizados, sentinelasIdentificadas, escoreTotal, classificacao } = resultado

  return (
    <div className="space-y-5">
      <ol className="space-y-4">
        <li className="flex gap-3">
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white"
          >
            1
          </span>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-slate-800">Dados utilizados</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Informações lidas do cadastro fictício do cidadão e do domicílio.
            </p>
            <ul className="mt-2 space-y-2">
              {dadosUtilizados.map((grupo) => (
                <li key={grupo.rotulo} className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
                  <p className="text-xs font-semibold text-slate-700">{grupo.rotulo}</p>
                  <ul className="mt-1.5 space-y-1">
                    {grupo.valores.map((valor) => (
                      <li key={valor} className="text-xs leading-relaxed text-slate-600">
                        • {valor}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </li>

        <li className="flex gap-3">
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white"
          >
            2
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-slate-800">Sentinelas encontradas e pontuação</h4>
            {sentinelasIdentificadas.length === 0 ? (
              <p className="mt-1 text-sm text-slate-600">
                Nenhuma sentinela foi identificada para esta família.
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-slate-100 overflow-hidden rounded-lg ring-1 ring-slate-200">
                {sentinelasIdentificadas.map((sentinela) => (
                  <li
                    key={sentinela.id}
                    className="flex items-center justify-between gap-3 bg-white px-3 py-2.5"
                  >
                    <span className="min-w-0 text-sm text-slate-700">
                      <span aria-hidden="true" className="mr-1.5 text-emerald-600">
                        ✓
                      </span>
                      {sentinela.nome}
                    </span>
                    <span className="shrink-0 text-sm font-bold text-slate-800">
                      {sentinela.pontos}{' '}
                      <span className="text-xs font-medium text-slate-500">
                        {pluralizar(sentinela.pontos, 'ponto', 'pontos')}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>

        <li className="flex gap-3">
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white"
          >
            3
          </span>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-slate-800">Soma final</h4>
            <p className="mt-1 text-sm text-slate-700">
              {sentinelasIdentificadas.length > 0 ? (
                <>
                  {sentinelasIdentificadas
                    .map((sentinela) => `${sentinela.pontos} (${sentinela.nome})`)
                    .join(' + ')}{' '}
                  ={' '}
                </>
              ) : null}
              <strong className="text-base font-bold text-brand-800">
                {escoreTotal} {pluralizar(escoreTotal, 'ponto', 'pontos')}
              </strong>
            </p>
          </div>
        </li>

        <li className="flex gap-3">
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white"
          >
            4
          </span>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-slate-800">Classificação correspondente</h4>
            <div className="mt-2">
              <RiskBadge classificacao={classificacao} />
            </div>
            {classificacao.nivel === null ? (
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                A pontuação {escoreTotal}{' '}
                {pluralizar(escoreTotal, 'ponto', 'pontos')} não está contemplada nas faixas
                definidas pela metodologia apresentada (5 ou 6, 7 ou 8 e acima de 9 pontos), por isso
                o protótipo exibe “Classificação não definida”.
              </p>
            ) : (
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Faixa aplicada: {FAIXAS_CLASSIFICACAO.find((f) => f.nivel === classificacao.nivel)
                  ?.descricaoFaixa}
                .
              </p>
            )}
          </div>
        </li>
      </ol>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-sm font-semibold text-slate-800">Faixas de classificação utilizadas</h4>
        <ul className="mt-2 space-y-1.5">
          {FAIXAS_CLASSIFICACAO.map((faixa) => (
            <li key={faixa.nivel} className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="rounded bg-white px-2 py-0.5 font-semibold text-slate-700 ring-1 ring-slate-200">
                {faixa.descricaoFaixa}
              </span>
              <span aria-hidden="true">→</span>
              <span>
                {faixa.nivel} – {faixa.descricao}
              </span>
            </li>
          ))}
          <li className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="rounded bg-white px-2 py-0.5 font-semibold text-slate-700 ring-1 ring-slate-200">
              0 a 4 pontos e exatamente 9 pontos
            </span>
            <span aria-hidden="true">→</span>
            <span>Classificação não definida na metodologia apresentada</span>
          </li>
        </ul>
      </div>
    </div>
  )
}


