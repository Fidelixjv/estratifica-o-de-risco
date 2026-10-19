import type { ResumoRisco } from '../../domain/estatisticas'

interface RiskDistributionProps {
  resumo: ResumoRisco
}

const ITENS = [
  { chave: 'Habitual', rotulo: 'Risco habitual', classe: 'bg-teal-500', texto: 'text-teal-800' },
  { chave: 'R1', rotulo: 'R1 – Risco menor', classe: 'bg-emerald-500', texto: 'text-emerald-800' },
  { chave: 'R2', rotulo: 'R2 – Risco médio', classe: 'bg-amber-500', texto: 'text-amber-800' },
  { chave: 'R3', rotulo: 'R3 – Risco máximo', classe: 'bg-rose-500', texto: 'text-rose-800' },
] as const

/** Distribuição das famílias por faixa de risco (barra + legenda com números). */
export function RiskDistribution({ resumo }: RiskDistributionProps) {
  const totalClassificadas = ITENS.reduce((total, item) => total + resumo.porNivel[item.chave], 0)

  return (
    <div>
      <div
        className="flex h-3 w-full overflow-hidden rounded-full bg-slate-200"
        role="img"
        aria-label={`Distribuição: ${resumo.porNivel.Habitual} famílias de risco habitual, ${resumo.porNivel.R1} de risco menor, ${resumo.porNivel.R2} de risco médio e ${resumo.porNivel.R3} de risco máximo.`}
      >
        {ITENS.map((item) =>
          totalClassificadas > 0 && resumo.porNivel[item.chave] > 0 ? (
            <div
              key={item.chave}
              className={item.classe}
              style={{
                width: `${(resumo.porNivel[item.chave] / totalClassificadas) * 100}%`,
              }}
            />
          ) : null,
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
      </ul>
    </div>
  )
}
