// Datas são tratadas como texto AAAA-MM-DD, calculadas em UTC para evitar problemas de fuso horário.

const MS_PER_DAY = 86_400_000;

export const MONTH_SHORT_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export const MONTH_NAMES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function toDayNumber(isoDate: string): number {
  const [year, month, day] = isoDate.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / MS_PER_DAY;
}

/** Dias corridos de `from` até `to` (negativo se `to` for anterior). */
export function daysBetween(from: string, to: string): number {
  return toDayNumber(to) - toDayNumber(from);
}

/** Soma (ou subtrai) dias a uma data. */
export function addDays(isoDate: string, days: number): string {
  return new Date((toDayNumber(isoDate) + days) * MS_PER_DAY).toISOString().slice(0, 10);
}

export function getYear(isoDate: string): number {
  return Number(isoDate.slice(0, 4));
}

/** Índice do mês: janeiro = 0 … dezembro = 11 */
export function getMonthIndex(isoDate: string): number {
  return Number(isoDate.slice(5, 7)) - 1;
}

/** "2026-09-13" → "13/09/2026" */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

/** Data e hora ISO → "14/09/2026 às 09:00" (no fuso horário de quem está usando) */
export function formatDateTime(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  const day = date.toLocaleDateString("pt-BR");
  const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${day} às ${time}`;
}
