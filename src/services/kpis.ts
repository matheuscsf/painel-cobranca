// Seção de KPIs: recuperado no ano, atraso médio, clientes em aberto e ticket médio.

import { COMPARISON_WINDOW_DAYS, REFERENCE_DATE } from "@/config/businessRules";
import { openBalanceOn } from "@/services/calculations";
import type { Recebimento } from "@/types/database";
import type { Kpi, Trend } from "@/types/dashboard";
import { sumBy } from "@/utils/array";
import { addDays, daysBetween } from "@/utils/dates";
import { formatCurrency, formatNumber, formatPercent } from "@/utils/formatters";

type PortfolioSnapshot = { averageDays: number | null; clients: number; ticket: number | null };

/** "Fotografia" da carteira vencida em uma data: atraso médio por parcela, clientes e saldo médio por cliente. */
function snapshotOn(recebimentos: Recebimento[], date: string): PortfolioSnapshot {
  let totalOpen = 0;
  let totalDays = 0;
  let parcelas = 0;
  const clients = new Set<string>();

  for (const parcela of recebimentos) {
    const open = openBalanceOn(parcela, date);
    if (open <= 0) continue;
    totalOpen += open;
    totalDays += daysBetween(parcela.dataVencimento, date);
    parcelas += 1;
    clients.add(parcela.chaveCliente);
  }

  return {
    averageDays: parcelas > 0 ? totalDays / parcelas : null,
    clients: clients.size,
    ticket: clients.size > 0 ? totalOpen / clients.size : null,
  };
}

/** Percentual já recebido sobre o valor líquido das parcelas. */
function recoveryRate(recebimentos: Recebimento[]): number | null {
  const total = sumBy(recebimentos, (r) => r.valorLiquido);
  return total > 0 ? (sumBy(recebimentos, (r) => r.valorBaixa) / total) * 100 : null;
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** Monta o selo de tendência. `lowerIsBetter` indica se uma queda é boa (ex.: atraso) ou ruim (ex.: recuperação). */
function makeTrend(
  current: number | null,
  previous: number | null,
  decimals: number,
  format: (absoluteDiff: number) => string,
  long: string,
  lowerIsBetter: boolean,
): Trend | null {
  if (current === null || previous === null) return null;
  const diff = round(current - previous, decimals);
  const sign = diff > 0 ? "+" : diff < 0 ? "-" : "";
  return { short: `${sign}${format(Math.abs(diff))}`, long, positive: lowerIsBetter ? diff <= 0 : diff >= 0 };
}

export function buildKpis(yearRecebimentos: Recebimento[], previousYearRecebimentos: Recebimento[], year: number): Kpi[] {
  const now = snapshotOn(yearRecebimentos, REFERENCE_DATE);
  const before = snapshotOn(yearRecebimentos, addDays(REFERENCE_DATE, -COMPARISON_WINDOW_DAYS));
  const rate = recoveryRate(yearRecebimentos);
  const vsWindow = ` vs. ${COMPARISON_WINDOW_DAYS} dias atrás`;

  return [
    {
      label: "Recuperado no ano",
      value: rate === null ? "—" : formatPercent(rate),
      trend: makeTrend(rate, recoveryRate(previousYearRecebimentos), 1, (v) => `${formatNumber(v, 1)}pp`, ` vs. ${year - 1}`, false),
    },
    {
      label: "Atraso médio",
      value: now.averageDays === null ? "—" : `${formatNumber(now.averageDays, 1)} dias`,
      trend: makeTrend(now.averageDays, before.averageDays, 1, (v) => `${formatNumber(v, 1)} dias`, vsWindow, true),
    },
    {
      label: "Clientes em aberto",
      value: String(now.clients),
      trend: makeTrend(now.clients, before.clients, 0, (v) => String(v), vsWindow, true),
    },
    {
      label: "Ticket médio",
      value: now.ticket === null ? "—" : formatCurrency(now.ticket),
      trend: makeTrend(now.ticket, before.ticket, 0, (v) => formatCurrency(v), vsWindow, true),
    },
  ];
}
