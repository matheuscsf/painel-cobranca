// Seção "Fila de cobrança": uma linha por cliente com saldo vencido, com os detalhes da gaveta.

import {
  COMPARISON_WINDOW_DAYS,
  PAYMENT_HISTORY_SIZE,
  REFERENCE_DATE,
  WORSENED_NEW_OVERDUE_MIN,
} from "@/config/businessRules";
import {
  AGING_BAND_SEVERITY,
  agingBandOf,
  daysOverdue,
  isOverdue,
  openBalanceOn,
  updatedValue,
} from "@/services/calculations";
import type { Lookups } from "@/services/lookups";
import type { Recebimento } from "@/types/database";
import type { AgingBand, QueueRow } from "@/types/dashboard";
import { sumBy } from "@/utils/array";
import { addDays, daysBetween, formatDate } from "@/utils/dates";
import { formatCurrency } from "@/utils/formatters";

type PaidParcela = Recebimento & { dataBaixa: string };

const isPaid = (parcela: Recebimento): parcela is PaidParcela => parcela.dataBaixa !== null;

const bandLabel = (band: AgingBand) => (band === "91+" ? "91+ dias" : `${band.replace("-", " a ")} dias`);

function groupByClient(recebimentos: Recebimento[]): Map<string, Recebimento[]> {
  const groups = new Map<string, Recebimento[]>();
  for (const parcela of recebimentos) {
    const list = groups.get(parcela.chaveCliente) ?? [];
    list.push(parcela);
    groups.set(parcela.chaveCliente, list);
  }
  return groups;
}

/** Empreendimento com maior saldo do cliente; se houver outros, adiciona "+N". */
function mainEnterpriseLabel(open: Recebimento[], lookups: Lookups): string {
  const totals = new Map<number, number>();
  for (const parcela of open) {
    totals.set(parcela.codigoEmpreendimento, (totals.get(parcela.codigoEmpreendimento) ?? 0) + parcela.saldo);
  }
  const [mainCode] = [...totals.entries()].sort((a, b) => b[1] - a[1])[0];
  const others = totals.size - 1;
  const name = lookups.empreendimentoName(mainCode);
  return others > 0 ? `${name} +${others}` : name;
}

/**
 * Motivos do selo "piorou", comparando a data-base com `compareDate`:
 * - a parcela mais atrasada passou para uma faixa de atraso pior;
 * - venceram (e não foram pagas) parcelas somando pelo menos WORSENED_NEW_OVERDUE_MIN.
 */
function worsenedReasons(parcelas: Recebimento[], currentBand: AgingBand, compareDate: string): string[] {
  const reasons: string[] = [];

  const overdueBefore = parcelas.filter((p) => openBalanceOn(p, compareDate) > 0);
  if (overdueBefore.length > 0) {
    const previousBand = agingBandOf(Math.max(...overdueBefore.map((p) => daysBetween(p.dataVencimento, compareDate))));
    if (previousBand && AGING_BAND_SEVERITY[currentBand] > AGING_BAND_SEVERITY[previousBand]) {
      reasons.push(`Passou de ${bandLabel(previousBand)} para ${bandLabel(currentBand)} de atraso`);
    }
  }

  const newOverdue = sumBy(
    parcelas.filter((p) => p.dataVencimento >= compareDate && isOverdue(p)),
    (p) => p.saldo,
  );
  if (newOverdue >= WORSENED_NEW_OVERDUE_MIN) {
    reasons.push(`${formatCurrency(newOverdue)} vencidos e não pagos nos últimos ${COMPARISON_WINDOW_DAYS} dias`);
  }

  return reasons;
}

export function buildCollectionQueue(yearRecebimentos: Recebimento[], lookups: Lookups): QueueRow[] {
  const compareDate = addDays(REFERENCE_DATE, -COMPARISON_WINDOW_DAYS);
  const rows: QueueRow[] = [];

  for (const [chave, parcelas] of groupByClient(yearRecebimentos)) {
    const open = parcelas.filter(isOverdue);
    if (open.length === 0) continue;

    const maxDaysOverdue = Math.max(...open.map((p) => daysOverdue(p)));
    const aging = agingBandOf(maxDaysOverdue);
    if (!aging) continue;

    const balance = sumBy(open, (p) => p.saldo);
    const payments = parcelas.filter(isPaid).sort((a, b) => b.dataBaixa.localeCompare(a.dataBaixa));

    rows.push({
      id: chave,
      name: lookups.clienteName(chave),
      enterprise: mainEnterpriseLabel(open, lookups),
      aging,
      balance: formatCurrency(balance),
      balanceRaw: balance,
      updatedBalance: formatCurrency(sumBy(open, (p) => updatedValue(p))),
      docs: open.length,
      maxDaysOverdue,
      paid: formatCurrency(sumBy(parcelas, (p) => p.valorBaixa)),
      lastPayment: payments.length > 0 ? formatDate(payments[0].dataBaixa) : null,
      worsenedReasons: worsenedReasons(parcelas, aging, compareDate),
      openDocs: [...open]
        .sort((a, b) => a.dataVencimento.localeCompare(b.dataVencimento))
        .map((p) => ({
          id: String(p.idLancamento),
          ref: p.numeroDocumento,
          due: formatDate(p.dataVencimento),
          value: formatCurrency(p.saldo, true),
          updatedValue: formatCurrency(updatedValue(p), true),
        })),
      paymentHistory: payments.slice(0, PAYMENT_HISTORY_SIZE).map((p) => ({
        id: String(p.idLancamento),
        date: formatDate(p.dataBaixa),
        description: `${p.status === "Baixado" ? "Pagamento total" : "Pagamento parcial"} · ${p.numeroDocumento}`,
        value: formatCurrency(p.valorBaixa, true),
      })),
    });
  }

  return rows.sort((a, b) => b.balanceRaw - a.balanceRaw);
}
