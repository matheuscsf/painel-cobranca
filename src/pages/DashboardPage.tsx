import { useMemo, useRef, useState } from "react";

import BackToTopButton from "@/components/layout/BackToTopButton";
import Navbar from "@/components/layout/Navbar";
import PageHeader from "@/components/layout/PageHeader";
import AgingDistributionCard from "@/features/aging/AgingDistributionCard";
import CollectionQueueSection from "@/features/collection-queue/CollectionQueueSection";
import ConcentrationCard from "@/features/concentration/ConcentrationCard";
import DesktopFilterBar from "@/features/filters/DesktopFilterBar";
import FilterFab from "@/features/filters/FilterFab";
import FilterSheet from "@/features/filters/FilterSheet";
import MobileFilterButton from "@/features/filters/MobileFilterButton";
import KpiGrid from "@/features/kpis/KpiGrid";
import MonthlyIncomeChart from "@/features/monthly-income/MonthlyIncomeChart";
import useDashboardData from "@/hooks/useDashboardData";
import useIsVisible from "@/hooks/useIsVisible";
import { buildFilterDefs, DEFAULT_FILTER_VALUES } from "@/services/filters";
import type { Database } from "@/types/database";
import type { FilterId, FilterValues } from "@/types/dashboard";

type DashboardPageProps = {
  database: Database;
  updatedAt: string;
  refreshing: boolean;
  refreshError: string | null;
  onRefresh: () => void;
};

/** Página do painel: guarda filtros e busca, calcula os dados e monta as seções. */
export default function DashboardPage({ database, updatedAt, refreshing, refreshError, onRefresh }: DashboardPageProps) {
  const [search, setSearch] = useState("");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>(DEFAULT_FILTER_VALUES);

  const filters = useMemo(() => buildFilterDefs(database), [database]);
  const { aging, kpis, monthlyIncome, concentration, queue } = useDashboardData(database, filterValues, search);

  // O botão flutuante de filtros aparece quando a barra de filtros do topo sai da tela
  const topFiltersRef = useRef<HTMLDivElement>(null);
  const topFiltersVisible = useIsVisible(topFiltersRef);

  const handleFilterChange = (id: FilterId, value: string) =>
    setFilterValues((prev) => ({ ...prev, [id]: value }));

  return (
    <div className={`min-h-screen bg-slate-50 ${refreshing ? "is-refreshing" : ""}`}>
      <Navbar />

      <main className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-12" aria-busy={refreshing}>
        <PageHeader
          search={search}
          onSearchChange={setSearch}
          refreshing={refreshing}
          onRefresh={onRefresh}
          updatedAt={updatedAt}
          refreshError={refreshError}
        />

        <div ref={topFiltersRef}>
          <DesktopFilterBar filters={filters} values={filterValues} onChange={handleFilterChange} />
          <MobileFilterButton count={filters.length} onClick={() => setFilterSheetOpen(true)} />
        </div>

        {/* Distribuição de atraso + KPIs */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" aria-label="Distribuição de atraso e indicadores">
          <AgingDistributionCard summary={aging} />
          <KpiGrid kpis={kpis} />
        </section>

        {/* Entrada mensal + Concentração */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <MonthlyIncomeChart data={monthlyIncome} />
          <ConcentrationCard data={concentration} />
        </div>

        {/* Fila de cobrança + gaveta de detalhes */}
        <CollectionQueueSection rows={queue} loading={refreshing} />

        <BackToTopButton />
      </main>

      <FilterFab visible={!topFiltersVisible && !filterSheetOpen} onClick={() => setFilterSheetOpen(true)} />

      <FilterSheet
        open={filterSheetOpen}
        filters={filters}
        values={filterValues}
        onChange={handleFilterChange}
        onClose={() => setFilterSheetOpen(false)}
      />
    </div>
  );
}
