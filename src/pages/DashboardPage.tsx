import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardList, ShieldCheck, TrendingUp, UserCheck, Users } from 'lucide-react'
import { Panel } from '../components/ui/Panel'
import { StatCard } from '../components/ui/StatCard'
import { FlowDiagram } from '../components/ui/FlowDiagram'
import { RiskDistribution } from '../components/dashboard/RiskDistribution'
import { FamilyCard } from '../components/family/FamilyCard'
import { useEstratificacoes, useFamiliasPorPrioridade, useResumoRisco } from '../hooks/useEstratificacoes'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { formatarData } from '../lib/formatar'

const LIMITE_DESTAQUE = 3

export function DashboardPage() {
  useTituloPagina('Dashboard')

  const resultados = useEstratificacoes()
  const resumo = useResumoRisco()
  const prioridade = useFamiliasPorPrioridade()
  const destaque = prioridade.slice(0, LIMITE_DESTAQUE)

  // Intervalo das datas de análise (menor e maior data registrada).
  const datas = resultados.map((resultado) => resultado.familia.ultimaAnalise).sort()
  const primeiraAnalise = datas[0]
  const ultimaAnalise = datas[datas.length - 1]

  return (
    <div className="space-y-6">
      <section aria-labelledby="titulo-dashboard">
        <h2 id="titulo-dashboard" className="text-xl font-semibold text-slate-800 sm:text-2xl">
          Visão geral da estratificação
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">
          Indicadores calculados automaticamente a partir das {resumo.totalFamilias} famílias
          cadastradas (datas de análise entre{' '}
          {formatarData(primeiraAnalise)} e {formatarData(ultimaAnalise)}).
        </p>
      </section>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <li>
          <StatCard
            rotulo="Famílias analisadas"
            valor={resumo.totalFamilias}
            auxiliar="Domicílios processados"
            icone={ClipboardList}
            tom="brand"
          />
        </li>
        <li>
          <StatCard
            rotulo="Cidadãos analisados"
            valor={resumo.totalCidadaos}
            auxiliar="Moradores vinculados aos domicílios"
            icone={Users}
            tom="slate"
          />
        </li>
        <li>
          <StatCard
            rotulo="Risco habitual"
            valor={resumo.porNivel.Habitual}
            auxiliar="Escore total de 0 a 4 pontos"
            icone={ShieldCheck}
            tom="teal"
          />
        </li>
        <li>
          <StatCard
            rotulo="Baixo risco (R1)"
            valor={resumo.porNivel.R1}
            auxiliar="Escore total de 5 ou 6 pontos"
            icone={ShieldCheck}
            tom="emerald"
          />
        </li>
        <li>
          <StatCard
            rotulo="Médio risco (R2)"
            valor={resumo.porNivel.R2}
            auxiliar="Escore total de 7 ou 8 pontos"
            icone={UserCheck}
            tom="amber"
          />
        </li>
        <li>
          <StatCard
            rotulo="Alto risco (R3)"
            valor={resumo.porNivel.R3}
            auxiliar="Escore total de 9 pontos ou mais"
            icone={TrendingUp}
            tom="rose"
          />
        </li>
        <li>
          <StatCard
            rotulo="Classificação não definida"
            valor={resumo.naoClassificadas}
            auxiliar="Escore fora das faixas válidas"
            icone={ClipboardList}
            tom="slate"
          />
        </li>
      </ul>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel
          titulo="Famílias com maior pontuação de risco"
          descricao="Ordenadas pelo escore total calculado, da maior para a menor pontuação."
          icone={TrendingUp}
          className="lg:col-span-2"
          corpoClassName="space-y-3"
        >
          {destaque.map((resultado) => (
            <FamilyCard key={resultado.familia.id} resultado={resultado} />
          ))}

          <Link
            to="/familias"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-800 hover:underline"
          >
            Ver todas as famílias
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Panel>

        <div className="space-y-4">
          <Panel titulo="Distribuição por faixa" icone={ShieldCheck}>
            <RiskDistribution resumo={resumo} />
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Maior pontuação: <strong className="text-slate-700">{resumo.maiorPontuacao}</strong>{' '}
              pontos. Média das famílias:{' '}
              <strong className="text-slate-700">{resumo.mediaPontuacao.toFixed(1).replace('.', ',')}</strong>{' '}
              pontos.
            </p>
          </Panel>

          <Panel titulo="Como funciona a estratificação" icone={ClipboardList}>
            <FlowDiagram />
          </Panel>
        </div>
      </div>
    </div>
  )
}
