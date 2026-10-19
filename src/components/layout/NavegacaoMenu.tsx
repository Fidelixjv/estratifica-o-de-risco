import { NavLink } from 'react-router-dom'
import { HeartPulse } from 'lucide-react'
import { ITENS_NAVEGACAO } from '../../config/navegacao'

interface NavegacaoMenuProps {
  onNavegar?: () => void
}

/** Conteúdo de navegação compartilhado pela barra lateral e pelo menu móvel. */
export function NavegacaoMenu({ onNavegar }: NavegacaoMenuProps) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white"
        >
          <HeartPulse className="size-6" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold leading-tight text-slate-800">
            Estratificação de Risco Familiar
          </span>
        </span>
      </div>

      <nav aria-label="Navegação principal" className="flex-1 p-3">
        <ul className="flex flex-col gap-1">
          {ITENS_NAVEGACAO.map((item) => (
            <li key={item.para}>
              <NavLink
                to={item.para}
                end={item.para === '/'}
                onClick={onNavegar}
                className={({ isActive }) =>
                  [
                    'flex items-start gap-3 rounded-xl px-3 py-3 text-sm transition-colors',
                    isActive
                      ? 'bg-brand-50 font-semibold text-brand-800 ring-1 ring-brand-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icone
                      aria-hidden="true"
                      className={[
                        'mt-0.5 size-5 shrink-0',
                        isActive ? 'text-brand-700' : 'text-slate-400',
                      ].join(' ')}
                    />
                    <span className="min-w-0">
                      <span className="block leading-tight">{item.rotulo}</span>
                      <span
                        className={[
                          'mt-0.5 block text-xs leading-tight',
                          isActive ? 'text-brand-700/80' : 'text-slate-500',
                        ].join(' ')}
                      >
                        {item.descricao}
                      </span>
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
