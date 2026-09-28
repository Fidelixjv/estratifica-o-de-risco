import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { EmptyState } from '../components/ui/EmptyState'
import { useTituloPagina } from '../hooks/useTituloPagina'

export function NaoEncontradaPage() {
  useTituloPagina('Página não encontrada')

  return (
    <EmptyState
      titulo="Página não encontrada"
      descricao="O endereço acessado não existe no protótipo. Use o menu para continuar a demonstração."
      icone={SearchX}
    >
      <Link
        to="/"
        className="inline-flex min-h-11 items-center rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
      >
        Voltar ao dashboard
      </Link>
    </EmptyState>
  )
}
