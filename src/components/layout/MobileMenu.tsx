import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { NavegacaoMenu } from './NavegacaoMenu'

interface MobileMenuProps {
  aberto: boolean
  aoFechar: () => void
}

/** Menu recolhível para telas pequenas (substitui a barra lateral no mobile). */
export function MobileMenu({ aberto, aoFechar }: MobileMenuProps) {
  const botaoFecharRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!aberto) return

    botaoFecharRef.current?.focus()
    document.body.style.overflow = 'hidden'

    function aoTeclar(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        aoFechar()
      }
    }

    document.addEventListener('keydown', aoTeclar)

    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = ''
    }
  }, [aberto, aoFechar])

  if (!aberto) return null

  return (
    <div className="lg:hidden">
      <div
        className="fixed inset-0 z-40 bg-slate-900/50"
        onClick={aoFechar}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className="fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-xs flex-col overflow-y-auto bg-white shadow-xl"
      >
        <div className="flex justify-end px-3 pt-3">
          <button
            ref={botaoFecharRef}
            type="button"
            onClick={aoFechar}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <X className="size-6" aria-hidden="true" />
            <span className="sr-only">Fechar menu</span>
          </button>
        </div>
        <NavegacaoMenu onNavegar={aoFechar} />
      </div>
    </div>
  )
}
