import type { ResumoRisco } from '../../domain/estatisticas'

interface RiskDistributionProps {
  resumo: ResumoRisco
}

const ITENS = [
  { chave: 'R1', rotulo: 'R1 – Risco menor', classe: 'bg-emerald-500', texto: 'text-emerald-800' },
  { chave: 'R2', rotulo: 'R2 – Risco médio', classe: 'bg-amber-500', texto: 'text-amber-800' },
  { chave: 'R3', rotulo: 'R3 – Risco máximo', classe: 'bg-rose-500', texto: 'text-rose-800' },
] as const

/** Distribuição das famílias por faixa de risco (barra + legenda com números). */
export function RiskDistribution({ resumo }: RiskDistributionProps) {
  const naoClassificadas = resumo.naoClassificadas

  return (
    <div>
      <div
        className="flex h-3 w-full overflow-hidden rounded-full bg-slate-200"
        role="img"
        aria-label={`Distribuição: ${resumo.porNivel.R1} famílias de risco menor, ${resumo.porNivel.R2} de risco médio, ${resumo.porNivel.R3} de risco máximo e ${naoClassificadas} sem classificação definida.`}
      >
        {ITENS.map((item) =>
          resumo.porNivel[item.chave] > 0 ? (
            <div
              key={item.chave}
              className={item.classe}
              style={{ width: `${(resumo.porNivel[item.chave] / resumo.totalFamilias) * 100}%` }}
            />
          ) : null,
        )}
        {naoClassificadas > 0 && (
          <div
            className="bg-slate-400"
            style={{ width: `${(naoClassificadas / resumo.totalFamilias) * 100}%` }}
          />
        )}
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {ITENS.map((item) => (
          <li key={item.chave} className="flex items-center gap-2 text-sm">
            <span aria-hidden="true" className={`size-3 shrink-0 rounded-full ${item.classe}`} />
            <span className="text-slate-600">{item.rotulo}</span>
            <span className={`ml-auto font-semibold ${item.texto}`}>
              {resumo.porNivel[item.chave]}
            </span>
          </li>
        ))}
        <li className="flex items-center gap-2 text-sm">
          <span aria-hidden="true" className="size-3 shrink-0 rounded-full bg-slate-400" />
          <span className="text-slate-600">Classificação não definida</span>
          <span className="ml-auto font-semibold text-slate-700">{naoClassificadas}</span>
        </li>
      </ul>
    </div>
  )
}
