import { useState } from "react";
import type { AgingSummary } from "@/types/dashboard";

export default function AgingDistributionCard({ summary }: { summary: AgingSummary }) {
  const [activeBucket, setActiveBucket] = useState<string | null>(null);

  return (
    <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 antialiased font-display">
          Distribuição de Atraso
        </h2>
        <span className="data-text text-sm font-medium text-slate-500 font-urbanist">
          <span className="font-semibold text-slate-700">{summary.totalOpen}</span> em aberto
        </span>
      </div>

      {/* Barra proporcional */}
      <div className="data-viz flex h-4 rounded-full overflow-hidden gap-0.5 mt-5 bg-slate-100" role="img" aria-label="Distribuição proporcional por faixa de atraso">
        {summary.buckets.map((b) => (
          <div
            key={b.id}
            className={`${b.color} transition-all duration-300 ${activeBucket === b.id ? "brightness-110" : ""}`}
            style={{ width: b.width }}
          />
        ))}
      </div>

      {/* Cartões por faixa */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {summary.buckets.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setActiveBucket(activeBucket === b.id ? null : b.id)}
            className={`text-left bg-slate-50 border rounded-xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-purple-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 ${activeBucket === b.id ? "border-purple-400 shadow-md -translate-y-0.5" : "border-slate-100"}`}
            aria-pressed={activeBucket === b.id}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: b.dotColor }} aria-hidden="true" />
              <span className="text-xs text-slate-500">{b.label}</span>
            </div>
            <p className="data-text text-lg font-bold text-slate-800 leading-tight">{b.value}</p>
            <p className="data-text text-xs text-slate-400 mt-0.5">{b.clients}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
