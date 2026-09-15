type TrendBadgeProps = {
  /** Variação exibida na pílula colorida, ex.: "+20,2 dias" */
  short: string;
  /** Legenda da comparação ao lado da pílula, ex.: "vs. 30 dias atrás" */
  long?: string;
  positive: boolean;
};

// Selo de tendência dos KPIs. A legenda desce para a linha de baixo quando não cabe ao lado da pílula.
export default function TrendBadge({ short, long, positive }: TrendBadgeProps) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1 max-w-full">
      <span
        className={`data-text whitespace-nowrap inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
      >
        {positive ? (
          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
        {short}
      </span>
      {long && <span className="data-text whitespace-nowrap text-xs text-slate-400">{long.trim()}</span>}
    </span>
  );
}
