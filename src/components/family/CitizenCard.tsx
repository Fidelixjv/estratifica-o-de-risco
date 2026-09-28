import { AlertTriangle, Check, Minus } from 'lucide-react'
import type { Cidadao } from '../../domain/types'
import type { CondicaoCidadao } from '../../domain/sentinels'
import { formatarIdade, idadeMesesCompletos } from '../../lib/idade'

interface SentinelaDoCidadao {
  nome: string
  pontos: number
}

interface CitizenCardProps {
  cidadao: Cidadao
  /** Condições avaliadas pelo mesmo motor de cálculo da família. */
  condicoes: CondicaoCidadao[]
  sentinelas: SentinelaDoCidadao[]
  rotuloOcupacao: string
}

const ROTULO_SEXO: Record<Cidadao['sexo'], string> = {
  F: 'Feminino',
  M: 'Masculino',
  Outro: 'Outro',
}

function ItemCondicao({ ativa, children }: { ativa: boolean; children: React.ReactNode }) {
  return (
    <li
      className={[
        'flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs',
        ativa
          ? 'bg-amber-50 font-semibold text-amber-900 ring-1 ring-amber-200'
          : 'bg-slate-50 text-slate-500',
      ].join(' ')}
    >
      {ativa ? (
        <AlertTriangle aria-hidden="true" className="size-3.5 shrink-0" />
      ) : (
        <Minus aria-hidden="true" className="size-3.5 shrink-0" />
      )}
      <span className="min-w-0">{children}</span>
      <span className="sr-only">{ativa ? ' — condição presente' : ' — condição ausente'}</span>
    </li>
  )
}

/** Cartão de um cidadão fictício vinculado ao domicílio. */
export function CitizenCard({ cidadao, condicoes, sentinelas, rotuloOcupacao }: CitizenCardProps) {
  const idadeMeses = idadeMesesCompletos(cidadao.dataNascimento)
  const pressao = cidadao.pressaoArterial

  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h4 className="text-base font-semibold text-slate-800">{cidadao.nome}</h4>
        <p className="text-sm text-slate-600">
          {formatarIdade(idadeMeses)} · {ROTULO_SEXO[cidadao.sexo]}
        </p>
      </header>

      <p className="mt-1 text-xs text-slate-500">
        Identificador fictício: <span className="font-mono">{cidadao.id}</span> · Ocupação:{' '}
        {rotuloOcupacao}
      </p>

      <h5 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Condições de saúde e situações
      </h5>
      <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
        {condicoes.map((condicao) => (
          <ItemCondicao key={condicao.id} ativa={condicao.ativa}>
            {condicao.rotulo}
          </ItemCondicao>
        ))}
      </ul>

      {pressao && (
        <p className="mt-3 text-xs text-slate-500">
          Última pressão arterial registrada (fictícia):{' '}
          <span className="font-semibold text-slate-700">
            {pressao.sistolica}x{pressao.diastolica} mmHg
          </span>{' '}
          · {pressao.usaMedicacaoAntiHipertensiva ? 'em uso de medicação' : 'sem medicação'}
        </p>
      )}

      {cidadao.situacoes.length > 0 && (
        <>
          <h5 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Situações identificadas
          </h5>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {cidadao.situacoes.map((situacao) => (
              <li key={situacao} className="flex items-start gap-2">
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-600" />
                <span>{situacao}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {sentinelas.length > 0 && (
        <div className="mt-4 border-t border-slate-200 pt-3">
          <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sentinelas geradas por este cadastro
          </h5>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {sentinelas.map((sentinela) => (
              <li
                key={sentinela.nome}
                className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-800 ring-1 ring-brand-200"
              >
                {sentinela.nome} · {sentinela.pontos}{' '}
                {sentinela.pontos === 1 ? 'ponto' : 'pontos'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
