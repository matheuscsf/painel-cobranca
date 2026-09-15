import { useMemo } from "react";

import { buildAgingSummary } from "@/services/aging";
import { buildCollectionQueue } from "@/services/collectionQueue";
import { buildConcentration } from "@/services/concentration";
import { filterByCompanyAndType, filterBySearch, filterByYear } from "@/services/filters";
import { buildKpis } from "@/services/kpis";
import { createLookups } from "@/services/lookups";
import { buildMonthlyIncome } from "@/services/monthlyIncome";
import type { Database } from "@/types/database";
import type { FilterValues } from "@/types/dashboard";

/**
 * Calcula todos os dados do painel a partir da base, dos filtros e da busca.
 * A busca vale para o painel inteiro: todas as seções mostram só os clientes encontrados.
 * Recalcula apenas quando algum desses três muda.
 */
export default function useDashboardData(database: Database, filters: FilterValues, search: string) {
  const lookups = useMemo(() => createLookups(database), [database]);

  return useMemo(() => {
    const year = Number(filters.ano);
    const scoped = filterBySearch(filterByCompanyAndType(database.recebimentos, filters), search, lookups);
    const yearRecebimentos = filterByYear(scoped, year);

    return {
      aging: buildAgingSummary(yearRecebimentos),
      kpis: buildKpis(yearRecebimentos, filterByYear(scoped, year - 1), year),
      monthlyIncome: buildMonthlyIncome(yearRecebimentos),
      concentration: buildConcentration(yearRecebimentos, lookups),
      queue: buildCollectionQueue(yearRecebimentos, lookups),
    };
  }, [database, lookups, filters, search]);
}
