import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Home, ListChecks, SearchX, Users } from 'lucide-react'
import { Panel } from '../components/ui/Panel'
import { EmptyState } from '../components/ui/EmptyState'
import { CitizenCard } from '../components/family/CitizenCard'
import { HouseholdInfo } from '../components/family/HouseholdInfo'
import { SentinelCard } from '../components/family/SentinelCard'
import { ScoreCard } from '../components/family/ScoreCard'
import { CalculationSummary } from '../components/family/CalculationSummary'
import { useEstratificacoes } from '../hooks/useEstratificacoes'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { condicoesDoCidadao } from '../domain/sentinels'
import type { SituacaoOcupacional } from '../domain/types'
import { formatarData, pluralizar } from '../lib/formatar'

const ROTULO_OCUPACAO: Record<SituacaoOcupacional, string> = {
  ocupado: 'Ocupado (remunerado)',
  naoRemunerado: 'Tarefas domésticas (consideradas ocupação)',
  desempregado: 'Sem ocupação registrada',
}

export function FamiliaDetalhePage() {
  const { id = '' } = useParams()
  const resultados = useEstratificacoes()
  const resultado = resultados.find((item) => item.familia.id === id)

  useTituloPagina(resultado ? `Família ${resultado.familia.id}` : 'Família não encontrada')

  /** Sentinelas que cada morador gerou, extraídas da avaliação da família. */
  const sentinelasPorCidadao = useMemo(() => {
    const mapa = new Map<string, { nome: string; pontos: number }[]>()

    for (const sentinela of resultado?.sentinelasIdentificadas ?? []) {
      for (const membroId of sentinela.membrosRelacionados) {
        const lista = mapa.get(membroId) ?? []
        lista.push({ nome: sentinela.nome, pontos: sentinela.pontos })
        mapa.set(membroId, lista)
      }
    }

    return mapa
  }, [resultado])

  if (!resultado) {
    return (
      <div className="space-y-6">
        <EmptyState
          titulo="Família não encontrada"
          descricao={`Nenhuma família cadastrada com o identificador "${id}".`}
          icone={SearchX}
        >
          <Link
            to="/familias"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Voltar para a lista de famílias
          </Link>
        </EmptyState>
      </div>
    )
  }

  const { familia, sentinelas, sentinelasIdentificadas, relacaoMoradorComodo } = resultado

  return (
    <div className="space-y-6">
      <Link
        to="/familias"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-800 hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Voltar para as famílias
      </Link>

      <section aria-labelledby="titulo-familia">
        <p className="text-sm font-semibold text-brand-700">{familia.id}</p>
        <h2 id="titulo-familia" className="mt-0.5 text-xl font-semibold text-slate-800 sm:text-2xl">
          {familia.identificacao}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{familia.situacao}</p>
      </section>

      <ScoreCard resultado={resultado} />

      <Panel
        selo="Seção 1"
        titulo="Informações da família"
        icone={Home}
        descricao="Identificação do domicílio analisado."
      >
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { rotulo: 'Identificação', valor: familia.identificacao },
            { rotulo: 'Moradores', valor: `${familia.membros.length}` },
            { rotulo: 'Domicílio', valor: familia.domicilio.identificacao },
            { rotulo: 'Última análise', valor: formatarData(familia.ultimaAnalise) },
          ].map((item) => (
            <div key={item.rotulo} className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
              <dt className="text-xs text-slate-500">{item.rotulo}</dt>
              <dd className="mt-0.5 text-sm font-semibold break-words text-slate-800">
                {item.valor}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel
        selo="Seção 2"
        titulo="Membros da família"
        icone={Users}
        descricao={`${familia.membros.length} ${pluralizar(
          familia.membros.length,
          'cidadão vinculado',
          'cidadãos vinculados',
        )} ao domicílio.`}
      >
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {familia.membros.map((cidadao) => (
            <li key={cidadao.id}>
              <CitizenCard
                cidadao={cidadao}
                condicoes={condicoesDoCidadao(cidadao)}
                sentinelas={sentinelasPorCidadao.get(cidadao.id) ?? []}
                rotuloOcupacao={ROTULO_OCUPACAO[cidadao.situacaoOcupacional]}
              />
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        selo="Seção 3"
        titulo="Informações do domicílio"
        icone={Home}
        descricao="Dados do domicílio utilizados na identificação das sentinelas."
      >
        <HouseholdInfo
          domicilio={familia.domicilio}
          relacao={relacaoMoradorComodo}
          ultimaAnalise={familia.ultimaAnalise}
        />
      </Panel>

      <Panel
        selo="Seção 4"
        titulo="Sentinelas identificadas"
        icone={ListChecks}
        descricao={`${sentinelasIdentificadas.length} de ${sentinelas.length} sentinelas da tabela foram identificadas neste domicílio. Cada sentinela pontua uma única vez por família.`}
        corpoClassName="p-0"
      >
        <ul className="divide-y divide-slate-100">
          {sentinelas.map((sentinela) => (
            <li key={sentinela.id} className="p-3 sm:p-4">
              <SentinelCard sentinela={sentinela} familia={familia} />
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        titulo="Como o resultado foi calculado?"
        icone={ListChecks}
        descricao="Rastreabilidade completa: dados lidos, sentinelas encontradas, soma e classificação."
      >
        <CalculationSummary resultado={resultado} />
      </Panel>
    </div>
  )
}
