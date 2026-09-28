import { Droplets, Home, Trash2, Users, Waves, type LucideIcon } from 'lucide-react'
import type { Domicilio } from '../../domain/types'
import type { RelacaoMoradorComodo } from '../../domain/estratificacao'
import { formatarData, pluralizar } from '../../lib/formatar'

interface HouseholdInfoProps {
  domicilio: Domicilio
  relacao: RelacaoMoradorComodo
  ultimaAnalise: string
}

function FatorSaneamento({
  ativo,
  rotulo,
  Icone,
}: {
  ativo: boolean
  rotulo: string
  Icone: LucideIcon
}) {
  return (
    <li
      className={[
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
        ativo
          ? 'bg-rose-50 font-medium text-rose-800 ring-1 ring-rose-200'
          : 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200',
      ].join(' ')}
    >
      <Icone aria-hidden="true" className="size-4 shrink-0" />
      <span className="min-w-0">{rotulo}</span>
      <span className="ml-auto shrink-0 text-xs font-semibold uppercase">
        {ativo ? 'Sim' : 'Não'}
      </span>
    </li>
  )
}

function Item({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
      <dt className="text-xs text-slate-500">{rotulo}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-slate-800">{valor}</dd>
    </div>
  )
}

/** Informações do domicílio fictício usadas no cálculo das sentinelas. */
export function HouseholdInfo({ domicilio, relacao, ultimaAnalise }: HouseholdInfoProps) {
  const percentual = relacao.proporcao === null ? 0 : Math.min(relacao.proporcao / 2, 1) * 100

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-slate-600">
        <span className="font-medium text-slate-700">{domicilio.identificacao}</span> —{' '}
        {domicilio.localizacaoFicticia}
      </p>

      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Item
          rotulo="Moradores"
          valor={`${domicilio.numeroMoradores} ${pluralizar(
            domicilio.numeroMoradores,
            'morador',
            'moradores',
          )}`}
        />
        <Item
          rotulo="Cômodos"
          valor={`${domicilio.numeroComodos} ${pluralizar(
            domicilio.numeroComodos,
            'cômodo',
            'cômodos',
          )}`}
        />
        <Item rotulo="Última análise" valor={formatarData(ultimaAnalise)} />
      </dl>

      <div>
        <h4 className="text-sm font-semibold text-slate-800">Condições de saneamento</h4>
        <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <FatorSaneamento ativo={domicilio.lixoACeuAberto} rotulo="Lixo a céu aberto" Icone={Trash2} />
          <FatorSaneamento ativo={domicilio.aguaSemTratamento} rotulo="Água sem tratamento" Icone={Droplets} />
          <FatorSaneamento ativo={domicilio.esgotoACeuAberto} rotulo="Esgoto a céu aberto" Icone={Waves} />
        </ul>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          A presença de qualquer um destes fatores já é suficiente para identificar a sentinela
          “Baixas condições de saneamento”.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Home aria-hidden="true" className="size-4 text-brand-700" />
          Relação morador/cômodo
        </h4>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2 text-sm text-slate-700">
          <span className="inline-flex items-center gap-1.5">
            <Users aria-hidden="true" className="size-4 text-slate-400" />
            {relacao.moradores} moradores
          </span>
          <span aria-hidden="true">/</span>
          <span>{relacao.comodos} cômodos</span>
          <span aria-hidden="true">=</span>
          <span className="text-base font-bold text-slate-800">{relacao.proporcaoFormatada}</span>
        </p>
        <div
          role="img"
          aria-label={`Relação morador por cômodo: ${relacao.proporcaoFormatada}. O limite de 1 morador por cômodo corresponde a 50% da barra.`}
          className="relative mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
        >
          <div className="h-full rounded-full bg-brand-600" style={{ width: `${percentual}%` }} />
          <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-0.5 bg-white" />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Barra cheia até 2 moradores por cômodo. A marca central representa o limite de 1 morador
          por cômodo.
        </p>
      </div>
    </div>
  )
}
