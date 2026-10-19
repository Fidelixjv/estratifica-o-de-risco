# Automatização da Estratificação de Risco Familiar — Protótipo Acadêmico

Protótipo web de um Trabalho de Conclusão de Curso que demonstra, de forma automática e
transparente, a **Estratificação de Risco Familiar** (Escala de Coelho-Savassi) a partir de
informações que, em um sistema real, seriam obtidas do **Prontuário Eletrônico do Cidadão (PEC)**.

> **Protótipo acadêmico — dados fictícios.**
> Não há integração real com o PEC, não são utilizados dados de pacientes e nenhuma informação
> pessoal real aparece na aplicação. Todos os moradores são identificados como “Pessoa NN” e os
> domicílios como “DOM-DEMO-00X”.

## Como executar

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm test         # testes do motor de cálculo e da classificação
npm run build    # verificação de tipos + build de produção
npm run lint     # lint (oxlint)
npm run preview  # serve o build de produção
```

A aplicação funciona inteiramente no navegador, sem depender de serviços externos.

## Ideia central

```
Prontuário Eletrônico do Cidadão
              ↓
Dados do cadastro do cidadão  +  Dados do domicílio
              ↓
Identificação das sentinelas
              ↓
Cálculo da pontuação
              ↓
Estratificação de risco (habitual / R1 / R2 / R3)
```

## Tabela de sentinelas aplicada

| Sentinela | Pontos | Origem da informação |
| --- | --- | --- |
| Acamado | 3 | morador |
| Deficiência física | 3 | morador |
| Deficiência mental | 3 | morador |
| Baixas condições de saneamento | 3 | domicílio (lixo a céu aberto **ou** água sem tratamento **ou** esgoto a céu aberto) |
| Desnutrição grave | 3 | morador (menores de 7 anos) |
| Drogadição | 2 | morador |
| Desemprego | 2 | morador (tarefas domésticas são ocupação) |
| Analfabetismo | 1 | morador (a partir da idade escolar) |
| Menores de 6 meses | 1 | morador (até 5 meses e 29 dias) |
| Maiores de 70 anos | 1 | morador (71 anos ou mais) |
| Hipertensão arterial | 1 | morador (PAS ≥ 140 e PAD ≥ 90 mmHg, sem medicação anti-hipertensiva) |
| Diabetes mellitus | 1 | morador |
| Relação morador/cômodo | 3 / 2 / 0 | domicílio (> 1, = 1 e < 1) |

Cada sentinela identificada pontua **uma única vez por família**, independentemente da quantidade
de moradores que apresentem o critério.

## Faixas de classificação

| Escore total | Classificação |
| --- | --- |
| 0 a 4 pontos | Risco habitual |
| 5 ou 6 pontos | R1 – Risco menor |
| 7 ou 8 pontos | R2 – Risco médio |
| 9 pontos ou mais | R3 – Risco máximo |

O risco habitual não recebe código R.

## Estrutura do projeto

```
src/
├── components/
│   ├── dashboard/     # RiskDistribution
│   ├── family/        # FamilyCard, FamilyTable, CitizenCard, HouseholdInfo,
│   │                  # SentinelCard, ScoreCard, CalculationSummary
│   ├── layout/        # AppLayout, Sidebar, NavegacaoMenu, MobileMenu, Header
│   └── ui/            # Panel, StatCard, RiskBadge, SearchBar, EmptyState,
│                      # PrototypeNotice, FlowDiagram
├── config/            # itens de navegação
├── data/              # familiasMock.ts (dados 100% fictícios)
├── domain/            # regras de negócio, isoladas da interface
│   ├── sentinelas.ts        # tabela de sentinelas e predicados
│   ├── classificacao.ts     # classificarRisco(escoreTotal)
│   ├── estratificacao.ts    # calcularRiscoFamilia(familia)
│   ├── estatisticas.ts      # indicadores do dashboard
│   ├── referencia.ts        # data de referência do protótipo
│   ├── types.ts
│   └── estratificacao.test.ts
├── hooks/             # useEstratificacoes, useTituloPagina
├── lib/               # idade.ts, formatar.ts
└── pages/             # Dashboard, Famílias, Detalhes da família, 404
```

### Onde a regra científica mora

- `src/domain/sentinels.ts` — tabela de sentinelas, pontuações e predicados. Cada regra tem uma
  única definição, reutilizada tanto pelo cálculo quanto pelos cartões dos cidadãos, evitando
  divergência entre cálculo e interface.
- `src/domain/classificacao.ts` — `classificarRisco(escoreTotal)`, com as faixas declaradas em
  `FAIXAS_CLASSIFICACAO` (risco habitual, R1, R2 e R3).
- `src/domain/estratificacao.ts` — `calcularRiscoFamilia(familia)`: lê os dados fictícios, avalia
  cada sentinela, soma os pontos e classifica o risco. Nenhuma pontuação é digitada nos dados.

Para incluir novas sentinelas ou novas faixas de classificação, basta alterar os arquivos acima.

## Questões em aberto documentadas no código

- **Idade escolar para analfabetismo:** a metodologia diz apenas “a partir da idade escolar”.
  Adotado 6 anos (`IDADE_ESCOLAR_MINIMA_ANOS`).
- **Hipertensão:** aplicada literalmente a definição recebida, que restringe a sentinela a
  indivíduos que não usam medicação anti-hipertensiva.
- **Maiores de 70 anos:** adotada a leitura de que é necessário ter completado 71 anos ou mais.
- **Desnutrição grave e diabetes mellitus:** a metodologia não define critério operacional; é
  considerado o registro da condição no cadastro fictício.
- **Escore negativo:** não possui faixa de classificação. Os escores gerados pelos dados do
  protótipo são não negativos.

## Responsividade e acessibilidade

Interface única e responsiva (testada de 360px a 1440px, sem rolagem horizontal):

- barra lateral fixa em telas grandes e menu recolhível nas pequenas;
- tabela de famílias a partir de 768px e cartões empilhados nas telas menores;
- alvos de toque com no mínimo 36–44px, rótulos em todos os campos e link de salto para o conteúdo;
- informações nunca comunicadas apenas por cor (selos de risco usam texto e símbolo);
- `aria-label`, `caption` em tabelas e textos alternativos para os indicadores visuais.
