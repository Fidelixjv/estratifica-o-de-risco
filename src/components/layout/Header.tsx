import { Menu } from 'lucide-react'

interface HeaderProps {
  titulo: string
  aoAbrirMenu: () => void
}

export function Header({ titulo, aoAbrirMenu }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={aoAbrirMenu}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="size-6" aria-hidden="true" />
          <span className="sr-only">Abrir menu de navegação</span>
        </button>

        <h1 className="min-w-0 flex-1 truncate text-base font-semibold text-slate-800 sm:text-lg">
          {titulo}
        </h1>

        <p className="hidden rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 sm:block">
          Protótipo acadêmico — dados fictícios
        </p>
      </div>
    </header>
  )
}
