import { useEffect, useRef, useState } from "react";
import ClientDetailsDrawer from "./ClientDetailsDrawer";
import QueueEmptyState from "./QueueEmptyState";
import QueueSkeletonRows from "./QueueSkeletonRows";
import QueueTableRow from "./QueueTableRow";
import type { QueueRow } from "@/types/dashboard";
import { formatCompactCurrency } from "@/utils/formatters";

const COLUMNS = ["Cliente", "Atraso", "Documentos", "Saldo em aberto", ""];

type CollectionQueueSectionProps = {
  rows: QueueRow[];
  loading: boolean;
};

export default function CollectionQueueSection({ rows, loading }: CollectionQueueSectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Se o cliente sair da lista (ex.: mudança de filtro), a gaveta fecha sozinha
  const selectedClient = rows.find((row) => row.id === selectedId) ?? null;

  // Volta a rolagem da tabela para o início quando a lista muda (filtros ou busca)
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [rows]);

  const totalBalance = rows.reduce((s, r) => s + r.balanceRaw, 0);

  return (
    <>
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Fila de cobrança
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {rows.length} {rows.length === 1 ? "cliente" : "clientes"} ·{" "}
              <span className="font-medium text-slate-700">{formatCompactCurrency(totalBalance)}</span> em aberto
              <span className="text-slate-400"> · Clique em uma linha para ver detalhes</span>
            </p>
          </div>
        </div>

        {/* Tabela com rolagem interna e cabeçalho fixo */}
        <div ref={scrollRef} className="w-full overflow-auto max-h-[560px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                {COLUMNS.map((h) => (
                  <th
                    key={h}
                    className="sticky top-0 z-10 bg-slate-50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap shadow-[inset_0_-1px_0_var(--color-slate-100)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            {loading && <QueueSkeletonRows />}

            {!loading && rows.length === 0 && <QueueEmptyState columns={COLUMNS.length} />}

            {!loading && rows.length > 0 && (
              <tbody>
                {rows.map((row) => (
                  <QueueTableRow key={row.id} row={row} onSelect={(r) => setSelectedId(r.id)} />
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>

      <ClientDetailsDrawer client={selectedClient} onClose={() => setSelectedId(null)} />
    </>
  );
}
