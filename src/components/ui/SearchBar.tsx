import { useId } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  valor: string
  aoAlterar: (valor: string) => void
  rotulo: string
  descricao?: string
  placeholder?: string
}

export function SearchBar({
  valor,
  aoAlterar,
  rotulo,
  descricao,
  placeholder = 'Buscar...',
}: SearchBarProps) {
  const idCampo = useId()
  const idDescricao = `${idCampo}-descricao`

  return (
    <div className="flex-1">
      <label htmlFor={idCampo} className="block text-sm font-medium text-slate-700">
        {rotulo}
      </label>
      {descricao && (
        <p id={idDescricao} className="mt-0.5 text-xs text-slate-500">
          {descricao}
        </p>
      )}
      <div className="relative mt-1.5">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400"
        />
        <input
          id={idCampo}
          type="search"
          value={valor}
          onChange={(evento) => aoAlterar(evento.target.value)}
          placeholder={placeholder}
          aria-describedby={descricao ? idDescricao : undefined}
          className="min-h-11 w-full rounded-xl border border-slate-300 bg-white py-2 pl-11 pr-11 text-base text-slate-800 placeholder:text-slate-400 focus:border-brand-600 sm:text-sm"
        />
        {valor && (
          <button
            type="button"
            onClick={() => aoAlterar('')}
            className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">Limpar campo de busca</span>
          </button>
        )}
      </div>
    </div>
  )
}
