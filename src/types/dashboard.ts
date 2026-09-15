// Tipos dos dados já calculados e formatados que os componentes do painel exibem.

// ── Filtros ───────────────────────────────────────────────────────────────────

export type FilterId = "ano" | "coligada" | "cobranca";

export type FilterOption = { value: string; label: string };

export type FilterDef = { id: FilterId; label: string; options: FilterOption[] };

export type FilterValues = Record<FilterId, string>;

// ── Distribuição de atraso ────────────────────────────────────────────────────

export type AgingBand = "01-29" | "30-60" | "61-90" | "91+";

export type AgingBucket = {
  id: AgingBand;
  label: string;
  value: string;
  clients: string;
  color: string;
  dotColor: string;
  width: string;
};

export type AgingSummary = { totalOpen: string; buckets: AgingBucket[] };

// ── KPIs ──────────────────────────────────────────────────────────────────────

export type Trend = { short: string; long: string; positive: boolean };

export type Kpi = { label: string; value: string; trend: Trend | null };

// ── Entrada mensal ────────────────────────────────────────────────────────────

/** Valores em reais de um mês (Jan = índice 0) e taxa de recuperação em %. */
export type MonthBar = { recovered: number; open: number; rate: number };

/** Frase de destaque: `highlight` é exibido em negrito entre `prefix` e `suffix`. */
export type Insight = { prefix: string; highlight: string; suffix: string };

export type MonthlyIncome = { months: MonthBar[]; insight: Insight };

// ── Concentração ──────────────────────────────────────────────────────────────

/** `pct`: tamanho da barra em relação ao maior item do ranking (o 1º = 100). */
export type ConcentrationRow = { name: string; value: string; pct: number };

export type ConcentrationRanking = {
  rows: ConcentrationRow[];
  /** Fatia dos maiores devedores (ex.: "42%"), ou null sem saldo em aberto */
  topShare: string | null;
  risk: "baixo" | "moderado" | "alto" | null;
};

export type Concentration = { clients: ConcentrationRanking; enterprises: ConcentrationRanking };

// ── Fila de cobrança ──────────────────────────────────────────────────────────

export type OpenDocument = { id: string; ref: string; due: string; value: string; updatedValue: string };

export type PaymentEntry = { id: string; date: string; description: string; value: string };

export type QueueRow = {
  id: string;
  name: string;
  enterprise: string;
  aging: AgingBand;
  balance: string;
  balanceRaw: number;
  updatedBalance: string;
  docs: number;
  maxDaysOverdue: number;
  paid: string;
  lastPayment: string | null;
  /** Motivos do selo "piorou" (vazio = sem selo). */
  worsenedReasons: string[];
  openDocs: OpenDocument[];
  paymentHistory: PaymentEntry[];
};
