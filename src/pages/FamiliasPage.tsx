import { useMemo, useState } from 'react'
import { SearchX, Users } from 'lucide-react'
import { Panel } from '../components/ui/Panel'
import { SearchBar } from '../components/ui/SearchBar'
import { EmptyState } from '../components/ui/EmptyState'
import { FamilyTable } from '../components/family/FamilyTable'
import { FamilyCard } from '../components/family/FamilyCard'
import { useEstratificacoes } from '../hooks/useEstratificacoes'
import { useTituloPagina } from '../hooks/useTituloPagina'
import type { ResultadoEstratificacao } from '../domain/estratificacao'
import { pluralizar } from '../lib/formatar'

function textoPesquisavel(resultado: ResultadoEstratificacao): string {
  const { familia } = resultado
  return [
    familia.id,
    familia.identificacao,
    familia.situacao,
    familia.domicilio.identificacao,
    familia.domicilio.localizacaoFicticia,
    ...familia.membros.map((membro) => membro.nome),
  ]
    .join(' ')
    .toLowerCase()
}

export function FamiliasPage() {
  useTituloPagina('Famílias')

  const resultados = useEstratificacoes()
  const [busca, setBusca] = useState('')

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    const ordenadas = [...resultados].sort((a, b) => b.escoreTotal - a.escoreTotal)

    if (!termo) return ordenadas
    return ordenadas.filter((resultado) => textoPesquisavel(resultado).includes(termo))
  }, [resultados, busca])

  return (
    <div className="space-y-6">
      <section aria-labelledby="titulo-familias">
        <h2 id="titulo-familias" className="text-xl font-semibold text-slate-800 sm:text-2xl">
          Famílias analisadas
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">
          Selecione uma família para ver seus moradores, as informações do domicílio, as sentinelas
          identificadas e a classificação de risco calculada.
        </p>
      </section>

      <Panel
        titulo="Lista de famílias"
        descricao={`${filtradas.length} de ${resultados.length} ${
          resultados.length === 1 ? 'família' : 'famílias'
        } exibida${filtradas.length === 1 ? '' : 's'}, ordenadas pela maior pontuação.`}
        icone={Users}
      >
        <SearchBar
          valor={busca}
          aoAlterar={setBusca}
          rotulo="Buscar família"
          descricao="Busque pelo identificador da família, do domicílio ou pelo nome do morador."
          placeholder="Ex.: FAM-003, DOM-007 ou Pessoa 01"
        />

        <div className="mt-5">
          {filtradas.length === 0 ? (
            <EmptyState
              titulo="Nenhuma família encontrada"
              descricao="Ajuste o termo da busca para localizar uma família cadastrada."
              icone={SearchX}
            >
              <button
                type="button"
                onClick={() => setBusca('')}
                className="min-h-11 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
              >
                Limpar busca
              </button>
            </EmptyState>
          ) : (
            <>
              {/* Tabela a partir do breakpoint md; cartões nas telas pequenas. */}
              <div className="hidden md:block">
                <FamilyTable resultados={filtradas} />
              </div>
              <ul className="grid grid-cols-1 gap-3 md:hidden">
                {filtradas.map((resultado) => (
                  <li key={resultado.familia.id}>
                    <FamilyCard resultado={resultado} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Exibindo{' '}
          {filtradas.length} {pluralizar(filtradas.length, 'resultado', 'resultados')}.
        </p>
      </Panel>
    </div>
  )
}
