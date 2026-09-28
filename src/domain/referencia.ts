/**
 * Data de referência utilizada pelo protótipo para calcular idades.
 *
 * Por que uma data fixa?
 * As sentinelas dependem da idade (menores de 6 meses, maiores de 70 anos,
 * menores de 7 anos). Fixar a referência mantém o cálculo determinístico:
 * os dados mockados sempre produzem a mesma pontuação, independentemente da
 * data em que o protótipo for aberto ou demonstrado.
 *
 * Em uma implementação real a referência seria a data corrente do sistema.
 */
export const DATA_REFERENCIA = '2026-09-28'
