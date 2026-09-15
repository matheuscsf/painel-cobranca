import KpiCard from "./KpiCard";
import type { Kpi } from "@/types/dashboard";

export default function KpiGrid({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="lg:col-span-5 grid grid-cols-2 grid-rows-2 gap-4 h-full">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} kpi={kpi} />
      ))}
    </div>
  );
}
