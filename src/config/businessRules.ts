// Regras de negócio do painel. Altere aqui para mudar o comportamento de todos os cálculos.

/** Data-base do painel: atrasos, saldos e comparações são calculados nesta data (AAAA-MM-DD). */
export const REFERENCE_DATE = "2026-09-13";

/** Janela, em dias, das comparações "vs. 30 dias atrás" e do selo "piorou". */
export const COMPARISON_WINDOW_DAYS = 30;

/**
 * Selo "piorou": o cliente recebe o selo se, na janela de comparação,
 * (1) sua parcela mais atrasada passou para uma faixa de atraso pior, OU
 * (2) acumulou pelo menos este valor (R$) em parcelas que venceram e não foram pagas.
 */
export const WORSENED_NEW_OVERDUE_MIN = 5000;

// ── Valor atualizado = saldo + correção monetária + multa + juros ────────────

/** Multa por atraso: 2% sobre o saldo. */
export const LATE_FEE_RATE = 0.02;

/** Juros de mora: 1% ao mês, proporcional aos dias de atraso. */
export const MONTHLY_INTEREST_RATE = 0.01;

/** Dias considerados em um mês no cálculo proporcional dos juros. */
export const DAYS_PER_MONTH = 30;

// ── Concentração ──────────────────────────────────────────────────────────────

/** Quantidade de itens exibidos no ranking de concentração (aparece no título: "Top 10"). */
export const RANKING_SIZE = 10;

/** Quantidade de maiores devedores considerada no risco de concentração. */
export const CONCENTRATION_TOP_N = 3;

/** Fatia (%) dos maiores devedores: até 30% = baixo, até 50% = moderado, acima = alto. */
export const CONCENTRATION_RISK_LIMITS = { low: 30, moderate: 50 };

// ── Histórico ─────────────────────────────────────────────────────────────────

/** Quantidade de pagamentos exibidos no histórico do cliente. */
export const PAYMENT_HISTORY_SIZE = 5;
