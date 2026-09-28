import { Info, LayoutDashboard, Users, type LucideIcon } from 'lucide-react'

export interface ItemNavegacao {
  para: string
  rotulo: string
  descricao: string
  icone: LucideIcon
}

/** Itens de navegação do protótipo, compartilhados entre menu lateral e menu móvel. */
export const ITENS_NAVEGACAO: ItemNavegacao[] = [
  {
    para: '/',
    rotulo: 'Dashboard',
    descricao: 'Visão geral dos indicadores',
    icone: LayoutDashboard,
  },
  {
    para: '/familias',
    rotulo: 'Famílias',
    descricao: 'Listagem das famílias fictícias',
    icone: Users,
  },
  {
    para: '/sobre',
    rotulo: 'Sobre o projeto',
    descricao: 'Objetivo e metodologia',
    icone: Info,
  },
]

/** Título exibido no cabeçalho conforme o caminho atual. */
export function tituloDaRota(pathname: string): string {
  if (pathname.startsWith('/familias/')) {
    return 'Detalhes da família'
  }

  const item = ITENS_NAVEGACAO.find((item) =>
    item.para === '/' ? pathname === '/' : pathname.startsWith(item.para),
  )

  return item?.rotulo ?? 'Página não encontrada'
}
