// Cálculos base de uma parcela, usados por todas as seções do painel.

import {
  DAYS_PER_MONTH,
  LATE_FEE_RATE,
  MONTHLY_INTEREST_RATE,
  REFERENCE_DATE,
} from "@/config/businessRules";
import type { Recebimento } from "@/types/database";
import type { AgingBand } from "@/types/dashboard";
import { daysBetween } from "@/utils/dates";

/**
 * Saldo vencido e não pago da parcela em uma data.
 * - Parcela ainda não vencida na data → 0
 * - Pagamento (total ou parcial) feito até a data → saldo atual
 * - Pagamento feito depois da data, ou sem pagamento → valor líquido inteiro
 */
export function openBalanceOn(parcela: Recebimento, date: string): number {
  if (parcela.dataVencimento >= date) return 0;
  if (parcela.dataBaixa !== null && parcela.dataBaixa <= date) return parcela.saldo;
  return parcela.valorLiquido;
}

/** A parcela está vencida e com saldo a receber na data-base? */
export function isOverdue(parcela: Recebimento): boolean {
  return openBalanceOn(parcela, REFERENCE_DATE) > 0;
}

/** Dias de atraso da parcela em uma data (0 se ainda não venceu). */
export function daysOverdue(parcela: Recebimento, date: string = REFERENCE_DATE): number {
  return Math.max(0, daysBetween(parcela.dataVencimento, date));
}

/** Ordem de gravidade das faixas de atraso (maior = pior). */
export const AGING_BAND_SEVERITY: Record<AgingBand, number> = { "01-29": 1, "30-60": 2, "61-90": 3, "91+": 4 };

/** Faixa de atraso: 01–29, 30–60, 61–90 ou 91+ dias. Retorna null se não houver atraso. */
export function agingBandOf(days: number): AgingBand | null {
  if (days <= 0) return null;
  if (days < 30) return "01-29";
  if (days <= 60) return "30-60";
  if (days <= 90) return "61-90";
  return "91+";
}

/** Valor atualizado = saldo + correção monetária + multa de 2% + juros de 1% ao mês (pro rata dia). */
export function updatedValue(parcela: Recebimento, date: string = REFERENCE_DATE): number {
  const balance = openBalanceOn(parcela, date);
  if (balance <= 0) return 0;

  const lateFee = balance * LATE_FEE_RATE;
  const interest = balance * MONTHLY_INTEREST_RATE * (daysOverdue(parcela, date) / DAYS_PER_MONTH);

  return balance + parcela.correcaoMonetaria + lateFee + interest;
}
