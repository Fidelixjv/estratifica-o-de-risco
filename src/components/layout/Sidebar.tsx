import { NavegacaoMenu } from './NavegacaoMenu'

interface SidebarProps {
  className?: string
}

/** Barra lateral fixa, exibida a partir do breakpoint `lg`. */
export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={[
        'hidden shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col',
        className,
      ].join(' ')}
    >
      <NavegacaoMenu />
    </aside>
  )
}
