import { useCallback, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { tituloDaRota } from '../../config/navegacao'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileMenu } from './MobileMenu'

export function AppLayout() {
  const { pathname } = useLocation()

  // O menu fica vinculado à rota em que foi aberto: ao navegar, deixa de ser
  // igual ao caminho atual e se fecha automaticamente, sem efeito colateral.
  const [rotaDoMenuAberto, setRotaDoMenuAberto] = useState<string | null>(null)
  const menuAberto = rotaDoMenuAberto === pathname

  const abrirMenu = useCallback(() => setRotaDoMenuAberto(pathname), [pathname])
  const fecharMenu = useCallback(() => setRotaDoMenuAberto(null), [])

  return (
    <div className="min-h-screen lg:flex">
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-800 focus:shadow"
      >
        Ir para o conteúdo principal
      </a>

      <Sidebar className="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto" />

      <MobileMenu aberto={menuAberto} aoFechar={fecharMenu} />

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <Header titulo={tituloDaRota(pathname)} aoAbrirMenu={abrirMenu} />

        <main id="conteudo-principal" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold text-slate-700">
              Automatização da Estratificação de Risco Familiar
            </p>
            <p className="mt-1 text-xs text-slate-500">Trabalho de Conclusão de Curso</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
