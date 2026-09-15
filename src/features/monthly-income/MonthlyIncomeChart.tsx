import type { MonthlyIncome } from "@/types/dashboard";
import { MONTH_SHORT_NAMES } from "@/utils/dates";
import { formatCurrency, formatPercent } from "@/utils/formatters";

const LEGEND = [
  { label: "Recuperado", color: "bg-purple-600" },
  { label: "Em aberto",  color: "bg-slate-300"  },
  { label: "Taxa",       color: "bg-purple-400" },
];

export default function MonthlyIncomeChart({ data }: { data: MonthlyIncome }) {
  const { months, insight } = data;
  const maxVal = Math.max(...months.map((d) => d.recovered + d.open));

  // Pontos da linha SVG da taxa de recuperação, centralizados em cada barra (somente meses com dados)
  const linePoints = months
    .map((d, i) => ({ ...d, i }))
    .filter((d) => d.recovered + d.open > 0)
    .map((d) => `${((d.i + 0.5) / months.length) * 100},${100 - d.rate}`)
    .join(" ");

  return (
    <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm p-6 flex flex-col h-full">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 antialiased font-display">
            Entrada mensal
          </h2>
          <p className="text-sm text-slate-400 mt-0.5 font-urbanist">
            Por mês de vencimento · barras em reais · linha em taxa de recuperação
          </p>
        </div>
        {/* Legenda */}
        <div className="flex items-center gap-4 flex-wrap">
          {LEGEND.map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              {l.label === "Taxa" ? (
                <span className="w-6 h-0.5 rounded-full bg-purple-400 inline-block" />
              ) : (
                <span className={`w-2.5 h-2.5 rounded-sm ${l.color} inline-block`} />
              )}
              <span className="text-xs text-slate-500">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico de barras + linha (altura proporcional ao espaço disponível no cartão) */}
      <div className="mt-6 flex-1 min-h-[240px] flex flex-col">
        <div className="flex gap-1 flex-1 relative">
          {/* Linhas de referência do eixo Y (h-0: a linha fica exatamente na posição do valor) */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none" aria-hidden="true">
            {[100, 75, 50, 25, 0].map((tick) => (
              <div key={tick} className="flex items-center gap-2 h-0">
                <span className="text-[10px] text-slate-300 w-6 text-right flex-shrink-0">
                  {tick}%
                </span>
                <div className="flex-1 border-t border-slate-100" />
              </div>
            ))}
          </div>

          {/* Barras */}
          <div className="data-viz flex gap-[3px] flex-1 pl-8 pb-0 relative z-10">
            {months.map((d, i) => {
              const total = d.recovered + d.open;
              const totalPct = maxVal > 0 ? (total / maxVal) * 100 : 0;
              const recoveredPct = total > 0 ? (d.recovered / total) * 100 : 0;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col justify-end group cursor-default"
                  title={`${MONTH_SHORT_NAMES[i]}: Recuperado ${formatCurrency(d.recovered)} | Em aberto ${formatCurrency(d.open)} | Taxa ${formatPercent(d.rate)}`}
                >
                  {total > 0 ? (
                    <div
                      className="w-full rounded-t-sm overflow-hidden flex flex-col-reverse transition-all duration-200 group-hover:brightness-105"
                      style={{ height: `${totalPct}%` }}
                    >
                      <div className="bg-purple-600" style={{ height: `${recoveredPct}%` }} />
                      <div className="bg-slate-300 flex-1" />
                    </div>
                  ) : (
                    <div className="w-full bg-slate-50 rounded-t-sm" style={{ height: "8px" }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Linha da taxa de recuperação */}
          <svg
            className="absolute inset-0 pl-8 pointer-events-none z-20"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{ left: "2rem", right: 0, top: 0, bottom: 0, width: "calc(100% - 2rem)", height: "100%", position: "absolute" }}
          >
            <polyline
              className="data-viz"
              points={linePoints}
              fill="none"
              stroke="#a78bfa"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* Rótulos do eixo X */}
        <div className="flex gap-[3px] pl-8 mt-2">
          {MONTH_SHORT_NAMES.map((m, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="text-[10px] text-slate-400">{m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Destaque */}
      <div className="mt-auto pt-5">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex gap-3 items-start">
          <svg className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
          </svg>
          <p className="data-text text-sm text-slate-600 leading-relaxed">
            {insight.prefix}
            {insight.highlight && <strong className="text-slate-800 font-semibold">{insight.highlight}</strong>}
            {insight.suffix}
          </p>
        </div>
      </div>
    </div>
  );
}
