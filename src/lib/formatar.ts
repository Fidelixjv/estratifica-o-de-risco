/** Formatação de datas e números no padrão brasileiro (pt-BR). */

const FORMATO_DATA = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

/** Converte "2026-09-20" em "20/09/2026". */
export function formatarData(iso: string): string {
  return FORMATO_DATA.format(new Date(`${iso}T00:00:00Z`))
}

/** Plural simples para rótulos como "1 morador" / "3 moradores". */
export function pluralizar(quantidade: number, singular: string, plural: string): string {
  return quantidade === 1 ? singular : plural
}
