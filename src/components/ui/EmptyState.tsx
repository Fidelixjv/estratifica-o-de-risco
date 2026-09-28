import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  titulo: string
  descricao: string
  icone: LucideIcon
  children?: React.ReactNode
}

export function EmptyState({ titulo, descricao, icone: Icone, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full bg-white text-slate-400 ring-1 ring-slate-200"
      >
        <Icone className="size-6" />
      </span>
      <div>
        <p className="font-semibold text-slate-800">{titulo}</p>
        <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-slate-500">{descricao}</p>
      </div>
      {children}
    </div>
  )
}
