import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, FileText, ShieldCheck } from 'lucide-react'
import { Panel } from '../components/ui/Panel'
import { PrototypeNotice } from '../components/ui/PrototypeNotice'
import { FlowDiagram } from '../components/ui/FlowDiagram'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { DEFINICOES_SENTINELAS, PONTOS_PADRAO } from '../domain/sentinels'
import { FAIXAS_CLASSIFICACAO } from '../domain/classificacao'
import { FAMILIAS_MOCK } from '../data/familiasMock'

export function SobrePage() {
  useTituloPagina('Sobre o projeto')

  return (
    <div className="space-y-6">
      <PrototypeNotice />

      <section aria-labelledby="titulo-sobre">
        <h2 id="titulo-sobre" className="text-xl font-semibold text-slate-800 sm:text-2xl">
          Automatização da Estratificação de Risco Familiar
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Este protótipo demonstra uma solução para automatizar a identificação dos fatores de risco
          de uma família e o cálculo da sua pontuação na Estratificação de Risco Familiar, conhecida
          como Escala de Coelho-Savassi. Na Atenção Primária à Saúde, essa estratificação orienta a
          equipe de saúde a identificar quais pacientes e famílias necessitam de maior atenção e
          acompanhamento. Hoje a avaliação é feita manualmente pela equipe, com base nas informações
          dos cidadãos e de seus domicílios, o que demanda tempo e precisa ser atualizado sempre que
          as condições mudarem.
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
          Em uma implementação real, a extensão obteria essas informações do Prontuário Eletrônico
          do Cidadão (PEC), relacionando o cadastro individual do cidadão, o cadastro do domicílio,
          as informações dos membros da família e os dados da residência. Com essas informações, as
          sentinelas seriam identificadas automaticamente, a pontuação calculada e a família
          classificada.
        </p>
      </section>

      <Panel
        titulo="Fluxo da solução"
        descricao="Dados do prontuário, identificação das sentinelas, cálculo e estratificação."
        icone={ArrowRight}
      >
        <FlowDiagram />
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel titulo="Objetivo da extensão" icone={FileText}>
          <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
            <li>• Automatizar a leitura das informações do cidadão e do domicílio.</li>
            <li>• Identificar automaticamente as sentinelas presentes em cada família.</li>
            <li>• Calcular a pontuação de cada sentinela e o escore total da família.</li>
            <li>• Classificar a família em R1, R2 ou R3 conforme as faixas da metodologia.</li>
            <li>
              • Mostrar de forma transparente como a pontuação foi obtida, evitando resultados em
              “caixa preta”.
            </li>
          </ul>
        </Panel>

        <Panel titulo="Sobre este protótipo" icone={BookOpen}>
          <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
            <li>• Trabalho de conclusão de curso, sem finalidade assistencial.</li>
            <li>• Exclusivamente dados fictícios: {FAMILIAS_MOCK.length} famílias, sem nomes reais.</li>
            <li>• Sem integração real com o PEC, sem login e sem banco de dados de produção.</li>
            <li>• Sem prescrição, prontuário médico, agendamento ou comunicação com sistemas oficiais.</li>
            <li>• Cálculo e classificação feitos no navegador, sem depender de serviços externos.</li>
          </ul>
        </Panel>
      </div>

      <Panel
        titulo="Sentinelas e pontuações utilizadas"
        descricao="Tabela aplicada pelo protótipo, exatamente como recebida na metodologia."
        icone={ShieldCheck}
        corpoClassName="p-0"
      >
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Sentinelas, definições resumidas e pontuação de cada critério.
            </caption>
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Sentinela
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Definição
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  Pontos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DEFINICOES_SENTINELAS.map((definicao) => (
                <tr key={definicao.id}>
                  <th scope="row" className="px-4 py-3 align-top font-semibold text-slate-800">
                    {definicao.nome}
                  </th>
                  <td className="max-w-md px-4 py-3 align-top text-slate-600">
                    {definicao.definicao}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right align-top font-bold text-slate-800">
                    {definicao.id === 'RELACAO_MORADOR_COMODO'
                      ? '0, 2 ou 3'
                      : PONTOS_PADRAO[definicao.id]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel titulo="Faixas de classificação do risco familiar" icone={ShieldCheck}>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {FAIXAS_CLASSIFICACAO.map((faixa) => (
            <li
              key={faixa.nivel}
              className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-200"
            >
              <span className="font-semibold text-slate-800">{faixa.nivel}</span>
              <span className="text-slate-600">{faixa.descricao}</span>
              <span className="ml-auto text-xs text-slate-500">{faixa.descricaoFaixa}</span>
            </li>
          ))}
          <li className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-200">
            <span className="font-semibold text-slate-800">—</span>
            <span className="text-slate-600">Classificação não definida</span>
            <span className="ml-auto text-xs text-slate-500">0 a 4 pontos e exatamente 9</span>
          </li>
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Pontuações fora das faixas definidas não recebem classificação: o protótipo não inventa
          regras que não foram fornecidas.
        </p>
      </Panel>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-600 shadow-sm sm:p-6">
        <p className="font-semibold text-slate-800">Como navegar na demonstração</p>
        <p className="mt-1">
          Dashboard → Famílias → selecionar uma família → seções de informações, sentinelas
          identificadas, cálculo e classificação do risco.
        </p>
        <Link
          to="/familias"
          className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-800 hover:underline"
        >
          Ir para a lista de famílias
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </div>
  )
}
