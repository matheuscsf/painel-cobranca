// Seção "Concentração": ranking de saldo vencido por cliente e por empreendimento.

import { CONCENTRATION_RISK_LIMITS, CONCENTRATION_TOP_N, RANKING_SIZE } from "@/config/businessRules";
import { isOverdue } from "@/services/calculations";
import type { Lookups } from "@/services/lookups";
import type { Recebimento } from "@/types/database";
import type { Concentration, ConcentrationRanking } from "@/types/dashboard";
import { formatCompactCurrency, formatPercent } from "@/utils/formatters";

function rank<K>(recebimentos: Recebimento[], keyOf: (parcela: Recebimento) => K, nameOf: (key: K) => string): ConcentrationRanking {
  const totals = new Map<K, number>();
  let totalOpen = 0;

  for (const parcela of recebimentos) {
    if (!isOverdue(parcela)) continue;
    const key = keyOf(parcela);
    totals.set(key, (totals.get(key) ?? 0) + parcela.saldo);
    totalOpen += parcela.saldo;
  }

  if (totalOpen <= 0) return { rows: [], topShare: null, risk: null };

  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  const topShare = (sorted.slice(0, CONCENTRATION_TOP_N).reduce((total, [, value]) => total + value, 0) / totalOpen) * 100;
  const largest = sorted[0][1];

  return {
    rows: sorted.slice(0, RANKING_SIZE).map(([key, value]) => ({
      name: nameOf(key),
      value: formatCompactCurrency(value),
      pct: (value / largest) * 100,
    })),
    topShare: formatPercent(topShare, 0),
    risk: topShare <= CONCENTRATION_RISK_LIMITS.low ? "baixo" : topShare <= CONCENTRATION_RISK_LIMITS.moderate ? "moderado" : "alto",
  };
}

export function buildConcentration(yearRecebimentos: Recebimento[], lookups: Lookups): Concentration {
  return {
    clients: rank(yearRecebimentos, (p) => p.chaveCliente, lookups.clienteName),
    enterprises: rank(yearRecebimentos, (p) => p.codigoEmpreendimento, lookups.empreendimentoName),
  };
}
