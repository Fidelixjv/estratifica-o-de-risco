import type { LucideIcon } from 'lucide-react'

export type Tom = 'brand' | 'emerald' | 'amber' | 'rose' | 'slate'

const TONS: Record<Tom, { icone: string; valor: string }> = {
  brand: { icone: 'bg-brand-50 text-brand-700', valor: 'text-brand-800' },
  emerald: { icone: 'bg-emerald-50 text-emerald-700', valor: 'text-emerald-800' },
  amber: { icone: 'bg-amber-50 text-amber-700', valor: 'text-amber-800' },
  rose: { icone: 'bg-rose-50 text-rose-700', valor: 'text-rose-800' },
  slate: { icone: 'bg-slate-100 text-slate-600', valor: 'text-slate-800' },
}

interface StatCardProps {
  rotulo: string
  valor: string | number
  auxiliar?: string
  icone: LucideIcon
  tom?: Tom
}

export function StatCard({ rotulo, valor, auxiliar, icone: Icone, tom = 'brand' }: StatCardProps) {
  const estilo = TONS[tom]

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-600">{rotulo}</p>
        <span
          aria-hidden="true"
          className={['flex size-9 shrink-0 items-center justify-center rounded-lg', estilo.icone].join(' ')}
        >
          <Icone className="size-5" />
        </span>
      </div>
      <p className={['mt-3 text-3xl font-bold tracking-tight sm:text-4xl', estilo.valor].join(' ')}>
        {valor}
      </p>
      {auxiliar && <p className="mt-1 text-xs leading-relaxed text-slate-500">{auxiliar}</p>}
    </div>
  )
}
