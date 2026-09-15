// Seção "Entrada mensal": recebido x em aberto por mês de vencimento, taxa de recuperação e frase de destaque.

import type { Recebimento } from "@/types/database";
import type { Insight, MonthBar, MonthlyIncome } from "@/types/dashboard";
import { getMonthIndex, MONTH_NAMES } from "@/utils/dates";
import { formatNumber, formatPercent } from "@/utils/formatters";

export function buildMonthlyIncome(yearRecebimentos: Recebimento[]): MonthlyIncome {
  const months: MonthBar[] = Array.from({ length: 12 }, () => ({ recovered: 0, open: 0, rate: 0 }));

  for (const parcela of yearRecebimentos) {
    const month = months[getMonthIndex(parcela.dataVencimento)];
    month.recovered += parcela.valorBaixa;
    month.open += parcela.saldo;
  }

  for (const month of months) {
    const total = month.recovered + month.open;
    month.rate = total > 0 ? (month.recovered / total) * 100 : 0;
  }

  return { months, insight: buildInsight(months) };
}

/** Compara a taxa do último mês com dados à média dos meses anteriores. */
function buildInsight(months: MonthBar[]): Insight {
  const withData = months
    .map((month, index) => ({ ...month, index }))
    .filter((month) => month.recovered + month.open > 0);

  if (withData.length < 2) {
    return { prefix: "Ainda não há meses suficientes para comparar a taxa de recuperação.", highlight: "", suffix: "" };
  }

  const last = withData[withData.length - 1];
  const previous = withData.slice(0, -1);
  const average = previous.reduce((total, month) => total + month.rate, 0) / previous.length;
  const diff = last.rate - average;

  const highlight =
    Math.abs(diff) < 0.05
      ? "em linha com a média"
      : `${formatNumber(Math.abs(diff), 1)}pp ${diff < 0 ? "abaixo" : "acima"} da média`;

  return {
    prefix: `Em ${MONTH_NAMES[last.index]}, a taxa de recuperação foi de ${formatPercent(last.rate)}, `,
    highlight,
    suffix: ` dos ${previous.length} meses anteriores (${formatPercent(average)}).`,
  };
}
