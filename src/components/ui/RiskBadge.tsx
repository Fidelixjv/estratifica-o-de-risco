import { type ClassificacaoRisco } from '../../domain/classificacao'

interface RiskBadgeProps {
  classificacao: ClassificacaoRisco
  tamanho?: 'sm' | 'md'
}

const ESTILOS = {
  R1: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  R2: 'bg-amber-50 text-amber-900 ring-amber-200',
  R3: 'bg-rose-50 text-rose-800 ring-rose-200',
  indefinida: 'bg-slate-100 text-slate-700 ring-slate-300',
} as const

/**
 * Selo de classificação do risco.
 * A informação nunca é comunicada apenas por cor: sempre há texto e símbolo.
 */
export function RiskBadge({ classificacao, tamanho = 'md' }: RiskBadgeProps) {
  const estilo = classificacao.nivel === null ? ESTILOS.indefinida : ESTILOS[classificacao.nivel]

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset',
        tamanho === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        estilo,
      ].join(' ')}
    >
      <span aria-hidden="true" className="font-mono">
        {classificacao.nivel ?? '—'}
      </span>
      <span>{classificacao.descricao}</span>
    </span>
  )
}
