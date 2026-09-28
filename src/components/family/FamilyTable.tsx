import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import type { ResultadoEstratificacao } from '../../domain/estratificacao'
import { RiskBadge } from '../ui/RiskBadge'
import { pluralizar } from '../../lib/formatar'

interface FamilyTableProps {
  resultados: ResultadoEstratificacao[]
}

/** Tabela de famílias — exibida a partir do breakpoint `md`. */
export function FamilyTable({ resultados }: FamilyTableProps) {
  return (
    // `relative` faz deste container o bloco de posicionamento dos elementos
    // absolutos internos, mantendo a rolagem horizontal restrita à tabela.
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <caption className="sr-only">
          Famílias fictícias analisadas, com número de moradores, pontuação e classificação de
          risco.
        </caption>
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th scope="col" className="px-3 py-3 font-semibold">
              Família
            </th>
            <th scope="col" className="px-3 py-3 font-semibold">
              Domicílio
            </th>
            <th scope="col" className="px-3 py-3 font-semibold">
              Moradores
            </th>
            <th scope="col" className="px-3 py-3 font-semibold">
              Pontuação
            </th>
            <th scope="col" className="px-3 py-3 font-semibold">
              Classificação
            </th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {resultados.map((resultado) => {
            const { familia, escoreTotal, classificacao } = resultado

            return (
              <tr key={familia.id} className="align-middle hover:bg-slate-50">
                <td className="px-3 py-3">
                  <p className="font-semibold text-slate-800">{familia.id}</p>
                  <p className="mt-0.5 max-w-[16rem] text-xs text-slate-500">{familia.situacao}</p>
                </td>
                <td className="px-3 py-3 text-slate-600">{familia.domicilio.identificacao}</td>
                <td className="px-3 py-3 text-slate-600">
                  {familia.membros.length}{' '}
                  {pluralizar(familia.membros.length, 'morador', 'moradores')}
                </td>
                <td className="px-3 py-3">
                  <span className="font-semibold text-slate-800">{escoreTotal}</span>{' '}
                  <span className="text-xs text-slate-500">
                    {pluralizar(escoreTotal, 'ponto', 'pontos')}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <RiskBadge classificacao={classificacao} tamanho="sm" />
                </td>
                <td className="px-3 py-3 text-right">
                  <Link
                    to={`/familias/${familia.id}`}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-sm font-semibold text-brand-800 hover:bg-brand-50"
                  >
                    <Eye aria-hidden="true" className="size-4" />
                    Visualizar
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
