// Opções dos filtros (geradas a partir dos dados) e aplicação dos filtros e da busca nas parcelas.

import { REFERENCE_DATE } from "@/config/businessRules";
import type { Lookups } from "@/services/lookups";
import type { Database, Recebimento } from "@/types/database";
import type { FilterDef, FilterValues } from "@/types/dashboard";
import { getYear } from "@/utils/dates";
import { normalizeText } from "@/utils/text";

/** Valor da opção "Todas" / "Todos os tipos". */
export const ALL_OPTION = "todos";

export const DEFAULT_FILTER_VALUES: FilterValues = {
  ano: String(getYear(REFERENCE_DATE)),
  coligada: ALL_OPTION,
  cobranca: ALL_OPTION,
};

const sortByName = <T extends { nome: string }>(items: T[]) =>
  [...items].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

/** Monta os filtros com as opções existentes na base: anos de vencimento, coligadas e tipos de cobrança. */
export function buildFilterDefs(database: Database): FilterDef[] {
  const years = [...new Set(database.recebimentos.map((r) => getYear(r.dataVencimento)))].sort((a, b) => a - b);

  return [
    {
      id: "ano",
      label: "Ano",
      options: years.map((year) => ({ value: String(year), label: String(year) })),
    },
    {
      id: "coligada",
      label: "Coligada",
      options: [
        { value: ALL_OPTION, label: "Todas" },
        ...sortByName(database.coligadas).map((c) => ({ value: String(c.codigo), label: c.nome })),
      ],
    },
    {
      id: "cobranca",
      label: "Cobrança",
      options: [
        { value: ALL_OPTION, label: "Todos os tipos" },
        ...sortByName(database.tiposCobranca).map((t) => ({ value: String(t.codigo), label: t.nome })),
      ],
    },
  ];
}

/** Aplica os filtros de coligada e tipo de cobrança (sem o ano). */
export function filterByCompanyAndType(recebimentos: Recebimento[], values: FilterValues): Recebimento[] {
  return recebimentos.filter(
    (r) =>
      (values.coligada === ALL_OPTION || r.codigoColigada === Number(values.coligada)) &&
      (values.cobranca === ALL_OPTION || r.codigoTipoCobranca === Number(values.cobranca)),
  );
}

/**
 * Busca por cliente: mantém todas as parcelas dos clientes cujo nome contém o texto
 * ou que possuem algum documento com esse número. Ignora acentos e maiúsculas.
 */
export function filterBySearch(recebimentos: Recebimento[], search: string, lookups: Lookups): Recebimento[] {
  const query = normalizeText(search);
  if (!query) return recebimentos;

  const matchedClients = new Set(
    recebimentos
      .filter(
        (r) =>
          normalizeText(lookups.clienteName(r.chaveCliente)).includes(query) ||
          normalizeText(r.numeroDocumento).includes(query),
      )
      .map((r) => r.chaveCliente),
  );

  return recebimentos.filter((r) => matchedClients.has(r.chaveCliente));
}

/** Mantém apenas as parcelas com vencimento no ano informado. */
export function filterByYear(recebimentos: Recebimento[], year: number): Recebimento[] {
  return recebimentos.filter((r) => getYear(r.dataVencimento) === year);
}
