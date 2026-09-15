import TrendBadge from "@/components/ui/TrendBadge";
import type { Kpi } from "@/types/dashboard";

export default function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-between gap-3 h-full">
      <p className="text-sm text-slate-400 leading-snug">{kpi.label}</p>
      <div>
        <p className="data-text text-2xl font-bold text-slate-900 leading-none">{kpi.value}</p>
        <div className="mt-3">
          {kpi.trend ? (
            <TrendBadge short={kpi.trend.short} long={kpi.trend.long} positive={kpi.trend.positive} />
          ) : (
            <span
              className="data-text whitespace-nowrap inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500"
            >
              Sem comparativo
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
