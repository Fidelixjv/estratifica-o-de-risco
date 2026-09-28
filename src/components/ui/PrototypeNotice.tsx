import { FlaskConical } from 'lucide-react'

interface PrototypeNoticeProps {
  className?: string
}

/** Indicador permanente de que os dados da demonstração são fictícios. */
export function PrototypeNotice({ className }: PrototypeNoticeProps) {
  return (
    <p
      className={[
        'flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-900 sm:text-sm',
        className,
      ].join(' ')}
    >
      <FlaskConical aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>
        <strong className="font-semibold">Protótipo acadêmico — dados fictícios.</strong>{' '}
        Nenhuma informação real de pessoas ou domicílios é utilizada, e não há integração com o
        Prontuário Eletrônico do Cidadão.
      </span>
    </p>
  )
}
