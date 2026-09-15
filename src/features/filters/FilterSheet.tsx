import FilterSelect from "./FilterSelect";
import type { FilterDef, FilterId, FilterValues } from "@/types/dashboard";

type FilterSheetProps = {
  open: boolean;
  filters: FilterDef[];
  values: FilterValues;
  onChange: (id: FilterId, value: string) => void;
  onClose: () => void;
};

// Painel de filtros aberto pelo botão "Filtros".
// Mobile: gaveta que sobe da parte de baixo da tela. Desktop: painel no canto inferior direito.
export default function FilterSheet({ open, filters, values, onChange, onClose }: FilterSheetProps) {
  return (
    <>
      {/* Fundo escurecido */}
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 ease-in-out bg-slate-900/40 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Painel */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out md:inset-x-auto md:right-8 md:bottom-8 md:w-96 md:rounded-3xl md:transition-all ${
          open
            ? "translate-y-0 md:opacity-100 md:pointer-events-auto"
            : "translate-y-full md:translate-y-4 md:opacity-0 md:pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros"
        aria-hidden={!open}
      >
        <div className="relative flex justify-center mt-3 mb-6">
          {/* Alça de arrastar (só faz sentido no mobile) */}
          <div className="w-12 h-1.5 bg-slate-200 rounded-full md:invisible" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 -top-1.5 p-1.5 rounded-full text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            aria-label="Fechar filtros"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
          <p className="text-sm font-semibold text-slate-800 mb-5 font-display">Filtros</p>

          <div className="flex flex-col gap-4">
            {filters.map((f) => (
              <FilterSelect key={f.id} filter={f} value={values[f.id]} onChange={(v) => onChange(f.id, v)} />
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:scale-[1.01] active:scale-[0.99] shadow-md"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", boxShadow: "0 4px 14px 0 rgba(109,40,217,0.30)" }}
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </>
  );
}
