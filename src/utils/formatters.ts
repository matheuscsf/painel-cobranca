const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const currencyWithCentsFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 1340.5 → "R$ 1.341" (ou "R$ 1.340,50" com centavos) */
export function formatCurrency(value: number, withCents = false): string {
  return (withCents ? currencyWithCentsFormatter : currencyFormatter).format(value);
}

/** 895449 → "R$ 895,4 mil" · 2016450 → "R$ 2,02 Mi" */
export function formatCompactCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `R$ ${formatNumber(value / 1_000_000, 2)} Mi`;
  if (Math.abs(value) >= 1_000) return `R$ ${formatNumber(value / 1_000, 1)} mil`;
  return formatCurrency(value, true);
}

/** 82.345 → "82,3" */
export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/** 46.83 → "46,8%" */
export function formatPercent(value: number, decimals = 1): string {
  return `${formatNumber(value, decimals)}%`;
}
