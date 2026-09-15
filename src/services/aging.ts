// Seção "Distribuição de Atraso": saldo vencido por faixa de dias.

import { agingBandOf, daysOverdue, isOverdue } from "@/services/calculations";
import type { Recebimento } from "@/types/database";
import type { AgingBand, AgingSummary } from "@/types/dashboard";
import { formatCompactCurrency } from "@/utils/formatters";

const BUCKETS: { id: AgingBand; label: string; color: string; dotColor: string }[] = [
  { id: "01-29", label: "01 a 29 dias", color: "bg-purple-300", dotColor: "#c4b5fd" },
  { id: "30-60", label: "30 a 60 dias", color: "bg-purple-400", dotColor: "#a78bfa" },
  { id: "61-90", label: "61 a 90 dias", color: "bg-purple-600", dotColor: "#7c3aed" },
  { id: "91+",   label: "91+ dias",     color: "bg-purple-800", dotColor: "#4c1d95" },
];

export function buildAgingSummary(recebimentos: Recebimento[]): AgingSummary {
  const totals = new Map<AgingBand, { value: number; clients: Set<string> }>();
  let totalOpen = 0;

  for (const parcela of recebimentos) {
    if (!isOverdue(parcela)) continue;
    const band = agingBandOf(daysOverdue(parcela));
    if (!band) continue;

    const entry = totals.get(band) ?? { value: 0, clients: new Set<string>() };
    entry.value += parcela.saldo;
    entry.clients.add(parcela.chaveCliente);
    totals.set(band, entry);
    totalOpen += parcela.saldo;
  }

  return {
    totalOpen: formatCompactCurrency(totalOpen),
    buckets: BUCKETS.map((bucket) => {
      const value = totals.get(bucket.id)?.value ?? 0;
      const clients = totals.get(bucket.id)?.clients.size ?? 0;
      return {
        ...bucket,
        value: formatCompactCurrency(value),
        clients: `${clients} ${clients === 1 ? "cliente" : "clientes"}`,
        width: totalOpen > 0 ? `${(value / totalOpen) * 100}%` : "0%",
      };
    }),
  };
}
