import { DATA_REFERENCIA } from '../domain/referencia'

function partesData(iso: string): { ano: number; mes: number; dia: number } {
  const [ano, mes, dia] = iso.split('-').map(Number)
  return { ano, mes, dia }
}

/** Idade em meses completos entre duas datas (AAAA-MM-DD). */
export function idadeMesesCompletos(
  nascimento: string,
  referencia: string = DATA_REFERENCIA,
): number {
  const n = partesData(nascimento)
  const r = partesData(referencia)

  let meses = (r.ano - n.ano) * 12 + (r.mes - n.mes)
  if (r.dia < n.dia) {
    meses -= 1
  }

  return Math.max(meses, 0)
}

/** Idade em anos completos entre duas datas (AAAA-MM-DD). */
export function idadeAnosCompletos(
  nascimento: string,
  referencia: string = DATA_REFERENCIA,
): number {
  return Math.floor(idadeMesesCompletos(nascimento, referencia) / 12)
}

/** Texto amigável para exibir a idade ("4 meses", "1 ano e 2 meses", "74 anos"). */
export function formatarIdade(idadeMeses: number): string {
  if (idadeMeses < 12) {
    return `${idadeMeses} ${idadeMeses === 1 ? 'mês' : 'meses'}`
  }

  const anos = Math.floor(idadeMeses / 12)
  const meses = idadeMeses % 12

  if (meses === 0) {
    return `${anos} ${anos === 1 ? 'ano' : 'anos'}`
  }

  return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${meses} ${meses === 1 ? 'mês' : 'meses'}`
}
