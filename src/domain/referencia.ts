/**
 * Data de referência utilizada para calcular idades.
 *
 * Por que uma data fixa?
 * As sentinelas dependem da idade (menores de 6 meses, maiores de 70 anos,
 * menores de 7 anos). Fixar a referência mantém o cálculo determinístico:
 * os mesmos dados sempre produzem a mesma pontuação, independentemente da data
 * em que o sistema for aberto.
 */
export const DATA_REFERENCIA = '2026-09-28'
