import { describe, expect, it } from 'vitest'
import { classificarRisco } from './classificacao'
import { calcularRiscoFamilia } from './estratificacao'
import { PONTOS_PADRAO } from './sentinels'
import { FAMILIAS_MOCK } from '../data/familiasMock'
import type { Familia } from './types'

/** Domicílio mínimo, usado para testar as regras isoladamente. */
function familiaBase(overrides: Partial<Familia> = {}): Familia {
  return {
    id: 'FAM-TEST',
    identificacao: 'Família de teste',
    situacao: 'Cenário de teste',
    ultimaAnalise: '2026-09-28',
    membros: [],
    domicilio: {
      id: 'DOM-TEST',
      identificacao: 'Domicílio de teste',
      localizacaoFicticia: 'Endereço de teste',
      numeroMoradores: 0,
      numeroComodos: 3,
      lixoACeuAberto: false,
      aguaSemTratamento: false,
      esgotoACeuAberto: false,
    },
    ...overrides,
  }
}

function cidadaoBase(overrides: Record<string, unknown> = {}) {
  return {
    id: 'P01',
    nome: 'Pessoa 01',
    dataNascimento: '1990-01-15',
    sexo: 'F' as const,
    situacaoOcupacional: 'ocupado' as const,
    alfabetizacao: 'alfabetizado' as const,
    restricaoDomiciliar: false,
    deficienciaFisica: false,
    deficienciaMental: false,
    desnutricaoGrave: false,
    drogadicao: false,
    diabetes: false,
    pressaoArterial: null,
    situacoes: [],
    ...overrides,
  }
}

describe('classificarRisco', () => {
  it('classifica de 0 a 4 pontos como risco habitual', () => {
    for (const escore of [0, 1, 2, 3, 4]) {
      expect(classificarRisco(escore)).toEqual({ nivel: 'Habitual', descricao: 'Risco habitual' })
    }
  })

  it('classifica 5 e 6 pontos como R1 – risco menor', () => {
    expect(classificarRisco(5)).toEqual({ nivel: 'R1', descricao: 'Risco menor' })
    expect(classificarRisco(6)).toEqual({ nivel: 'R1', descricao: 'Risco menor' })
  })

  it('classifica 7 e 8 pontos como R2 – risco médio', () => {
    expect(classificarRisco(7)).toEqual({ nivel: 'R2', descricao: 'Risco médio' })
    expect(classificarRisco(8)).toEqual({ nivel: 'R2', descricao: 'Risco médio' })
  })

  it('classifica 9 pontos ou mais como R3 – risco máximo', () => {
    expect(classificarRisco(9)).toEqual({ nivel: 'R3', descricao: 'Risco máximo' })
    expect(classificarRisco(10)).toEqual({ nivel: 'R3', descricao: 'Risco máximo' })
    expect(classificarRisco(28)).toEqual({ nivel: 'R3', descricao: 'Risco máximo' })
  })

  it('não classifica escores negativos', () => {
    expect(classificarRisco(-1)).toEqual({
      nivel: null,
      descricao: 'Classificação não definida',
    })
  })
})

describe('calcularRiscoFamilia', () => {
  it('soma zero quando nenhuma sentinela é identificada', () => {
    const resultado = calcularRiscoFamilia(familiaBase({ membros: [cidadaoBase()] }))

    expect(resultado.escoreTotal).toBe(0)
    expect(resultado.sentinelasIdentificadas).toHaveLength(0)
    expect(resultado.classificacao).toEqual({ nivel: 'Habitual', descricao: 'Risco habitual' })
  })

  it('calcula a relação morador/cômodo por faixa', () => {
    const cenarios = [
      { moradores: 3, comodos: 2, pontos: 3 }, // 1,5 -> maior que 1
      { moradores: 2, comodos: 2, pontos: 2 }, // 1,0 -> igual a 1
      { moradores: 1, comodos: 3, pontos: 0 }, // 0,33 -> menor que 1
    ]

    for (const cenario of cenarios) {
      const resultado = calcularRiscoFamilia(
        familiaBase({
          domicilio: {
            ...familiaBase().domicilio,
            numeroMoradores: cenario.moradores,
            numeroComodos: cenario.comodos,
          },
        }),
      )

      expect(resultado.relacaoMoradorComodo.pontos).toBe(cenario.pontos)
      expect(resultado.escoreTotal).toBe(cenario.pontos)
    }
  })

  it('identifica saneamento baixo com apenas um dos três fatores', () => {
    for (const fator of ['lixoACeuAberto', 'aguaSemTratamento', 'esgotoACeuAberto'] as const) {
      const resultado = calcularRiscoFamilia(
        familiaBase({ domicilio: { ...familiaBase().domicilio, [fator]: true } }),
      )

      expect(resultado.escoreTotal).toBe(PONTOS_PADRAO.SANEAMENTO_BAIXO)
    }
  })

  it('aplica as faixas etárias das sentinelas de lactente e idoso', () => {
    const resultado = calcularRiscoFamilia(
      familiaBase({
        membros: [
          cidadaoBase({ id: 'P01', nome: 'Bebê', dataNascimento: '2026-05-30' }), // 3 meses
          cidadaoBase({ id: 'P02', nome: 'Lactente limite', dataNascimento: '2026-03-29' }), // 5m29d
        ],
      }),
    )

    expect(resultado.sentinelas.find((s) => s.id === 'MENOR_SEIS_MESES')?.identificada).toBe(true)

    const semLactente = calcularRiscoFamilia(
      familiaBase({ membros: [cidadaoBase({ dataNascimento: '2026-03-28' })] }), // 6m1d
    )
    expect(semLactente.sentinelas.find((s) => s.id === 'MENOR_SEIS_MESES')?.identificada).toBe(
      false,
    )

    const idoso = calcularRiscoFamilia(
      familiaBase({ membros: [cidadaoBase({ dataNascimento: '1956-09-28' })] }), // 70 anos exatos
    )
    expect(idoso.sentinelas.find((s) => s.id === 'MAIOR_SETENTA_ANOS')?.identificada).toBe(false)

    const idosoAvancado = calcularRiscoFamilia(
      familiaBase({ membros: [cidadaoBase({ dataNascimento: '1955-09-27' })] }), // 71 anos
    )
    expect(
      idosoAvancado.sentinelas.find((s) => s.id === 'MAIOR_SETENTA_ANOS')?.identificada,
    ).toBe(true)
  })

  it('considera a sentinela de idoso apenas com mais de 70 anos completos', () => {
    const resultado = calcularRiscoFamilia(
      familiaBase({ membros: [cidadaoBase({ dataNascimento: '1950-01-01' })] }),
    )

    expect(resultado.sentinelas.find((s) => s.id === 'MAIOR_SETENTA_ANOS')?.identificada).toBe(
      true,
    )
  })

  it('aplica o limiar de pressão arterial da definição recebida', () => {
    const acima = calcularRiscoFamilia(
      familiaBase({
        membros: [
          cidadaoBase({
            pressaoArterial: {
              sistolica: 140,
              diastolica: 90,
              usaMedicacaoAntiHipertensiva: false,
              data: '2026-09-01',
            },
          }),
        ],
      }),
    )
    expect(acima.sentinelas.find((s) => s.id === 'HIPERTENSAO_ARTERIAL')?.identificada).toBe(true)

    const abaixo = calcularRiscoFamilia(
      familiaBase({
        membros: [
          cidadaoBase({
            pressaoArterial: {
              sistolica: 139,
              diastolica: 90,
              usaMedicacaoAntiHipertensiva: false,
              data: '2026-09-01',
            },
          }),
        ],
      }),
    )
    expect(abaixo.sentinelas.find((s) => s.id === 'HIPERTENSAO_ARTERIAL')?.identificada).toBe(false)

    const emUsoDeMedicacao = calcularRiscoFamilia(
      familiaBase({
        membros: [
          cidadaoBase({
            pressaoArterial: {
              sistolica: 160,
              diastolica: 100,
              usaMedicacaoAntiHipertensiva: true,
              data: '2026-09-01',
            },
          }),
        ],
      }),
    )
    expect(
      emUsoDeMedicacao.sentinelas.find((s) => s.id === 'HIPERTENSAO_ARTERIAL')?.identificada,
    ).toBe(false)
  })

  it('não considera tarefas domésticas como desemprego', () => {
    const resultado = calcularRiscoFamilia(
      familiaBase({
        membros: [cidadaoBase({ situacaoOcupacional: 'naoRemunerado' })],
      }),
    )

    expect(resultado.sentinelas.find((s) => s.id === 'DESEMPREGO')?.identificada).toBe(false)
  })

  it('pontua uma sentinela uma única vez mesmo com vários moradores', () => {
    const resultado = calcularRiscoFamilia(
      familiaBase({
        membros: [
          cidadaoBase({ id: 'P01', nome: 'Pessoa 01', drogadicao: true }),
          cidadaoBase({ id: 'P02', nome: 'Pessoa 02', drogadicao: true }),
          cidadaoBase({ id: 'P03', nome: 'Pessoa 03', drogadicao: true }),
        ],
      }),
    )

    expect(resultado.escoreTotal).toBe(PONTOS_PADRAO.DROGADICAO)
  })

  it('limita a desnutrição grave a menores de 7 anos', () => {
    const menor = calcularRiscoFamilia(
      familiaBase({ membros: [cidadaoBase({ dataNascimento: '2020-01-01', desnutricaoGrave: true })] }),
    )
    expect(menor.sentinelas.find((s) => s.id === 'DESNUTRICAO_GRAVE')?.identificada).toBe(true)

    const adulto = calcularRiscoFamilia(
      familiaBase({ membros: [cidadaoBase({ dataNascimento: '2010-01-01', desnutricaoGrave: true })] }),
    )
    expect(adulto.sentinelas.find((s) => s.id === 'DESNUTRICAO_GRAVE')?.identificada).toBe(false)
  })
})

describe('dados de famílias', () => {
  const resultados = FAMILIAS_MOCK.map(calcularRiscoFamilia)

  const escoresEsperados: Record<string, number> = {
    'FAM-001': 0,
    'FAM-002': 5,
    'FAM-003': 12,
    'FAM-004': 5,
    'FAM-005': 3,
    'FAM-006': 7,
    'FAM-007': 9,
    'FAM-008': 6,
    'FAM-009': 8,
    'FAM-010': 18,
  }

  it.each(Object.entries(escoresEsperados))('%s soma %i pontos', (id, esperado) => {
    const resultado = resultados.find((item) => item.familia.id === id)!

    expect(resultado.escoreTotal).toBe(esperado)
  })

  it('cobre todas as faixas de classificação, incluindo os limites 0 e 9', () => {
    const niveis = resultados.map((resultado) => resultado.classificacao.nivel)

    expect(resultados.find((resultado) => resultado.escoreTotal === 0)?.classificacao.nivel).toBe(
      'Habitual',
    )
    expect(resultados.find((resultado) => resultado.escoreTotal === 9)?.classificacao.nivel).toBe(
      'R3',
    )
    expect(niveis).toContain('R1')
    expect(niveis).toContain('R2')
    expect(niveis).toContain('R3')
    expect(niveis).toContain('Habitual')
    expect(niveis).not.toContain(null)
  })

  it('não utiliza nomes reais: todos os moradores são "Pessoa NN"', () => {
    for (const familia of FAMILIAS_MOCK) {
      for (const membro of familia.membros) {
        expect(membro.nome).toMatch(/^Pessoa \d{2}$/)
      }
    }
  })
})
