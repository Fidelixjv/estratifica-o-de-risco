import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface PanelProps {
  titulo?: string
  descricao?: string
  icone?: LucideIcon
  /** Numeração exibida antes do título (ex.: "Seção 2"). */
  selo?: string
  acoes?: ReactNode
  className?: string
  corpoClassName?: string
  children: ReactNode
}

/** Cartão base reutilizado por todas as seções da interface. */
export function Panel({
  titulo,
  descricao,
  icone: Icone,
  selo,
  acoes,
  className,
  corpoClassName,
  children,
}: PanelProps) {
  return (
    <section
      className={['rounded-2xl border border-slate-200 bg-white shadow-sm', className].join(' ')}
    >
      {(titulo || acoes) && (
        <header className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            {Icone && (
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700"
              >
                <Icone className="size-5" />
              </span>
            )}
            <div className="min-w-0">
              <h2 className="flex flex-wrap items-center gap-2 text-base font-semibold text-slate-800 sm:text-lg">
                {selo && (
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {selo}
                  </span>
                )}
                {titulo}
              </h2>
              {descricao && (
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{descricao}</p>
              )}
            </div>
          </div>
          {acoes && <div className="shrink-0">{acoes}</div>}
        </header>
      )}
      <div className={['px-4 py-4 sm:px-6 sm:py-5', corpoClassName].join(' ')}>{children}</div>
    </section>
  )
}
