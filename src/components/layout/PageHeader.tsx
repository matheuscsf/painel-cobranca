import { REFERENCE_DATE } from "@/config/businessRules";
import { formatDate, formatDateTime } from "@/utils/dates";

type PageHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  refreshing: boolean;
  onRefresh: () => void;
  /** Data e hora (ISO) da última atualização dos dados */
  updatedAt: string;
  refreshError: string | null;
};

export default function PageHeader({ search, onSearchChange, refreshing, onRefresh, updatedAt, refreshError }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 antialiased leading-tight">Análise da Carteira de Cobrança</h1>
        <p className="font-urbanist text-sm text-slate-400 mt-1">
          Posição da carteira em {formatDate(REFERENCE_DATE)} · Atualizado em {formatDateTime(updatedAt)}
        </p>
        {refreshError && (
          <p className="text-sm text-rose-600 mt-1" role="alert">
            Não foi possível atualizar os dados: {refreshError}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Busca */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar cliente ou documento"
            className="pl-9 pr-4 py-2.5 bg-slate-100 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none border-2 border-transparent focus:border-purple-400 focus:bg-white transition-all duration-200 w-60 max-w-full"
            aria-label="Buscar cliente ou documento"
          />
        </div>

        {/* Atualizar: baixa a versão mais recente dos dados */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${refreshing ? "opacity-70 pointer-events-none" : "hover:scale-[1.03] active:scale-[0.98]"}`}
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", boxShadow: "0 4px 14px 0 rgba(109,40,217,0.35)" }}
        >
          <svg
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.077 9a8 8 0 0 1 13.846 0M18.923 15A8 8 0 0 1 5.077 15" />
          </svg>
          {refreshing ? "Atualizando..." : "Atualizar"}
        </button>
      </div>
    </div>
  );
}
