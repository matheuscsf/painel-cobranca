import { useState } from "react";
import { CONCENTRATION_TOP_N, RANKING_SIZE } from "@/config/businessRules";
import type { Concentration } from "@/types/dashboard";

type ConcentrationTab = "clientes" | "empreendimentos";

export default function ConcentrationCard({ data }: { data: Concentration }) {
  const [tab, setTab] = useState<ConcentrationTab>("clientes");
  const ranking = tab === "clientes" ? data.clients : data.enterprises;

  return (
    <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm p-6 flex flex-col h-full">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 antialiased font-display">
            Concentração · Top {RANKING_SIZE}
          </h2>
          <p className="text-sm text-slate-400 mt-0.5 font-urbanist">
            Maiores saldos em aberto
          </p>
        </div>
        {/* Abas */}
        <div className="bg-slate-100 p-1 rounded-lg inline-flex items-center gap-0.5">
          {(["clientes", "empreendimentos"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-150 capitalize ${
                tab === t
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t === "clientes" ? "Clientes" : "Empreend."}
            </button>
          ))}
        </div>
      </div>

      {/* Ranking */}
      <div className="flex flex-col gap-3 flex-1">
        {ranking.rows.map((row, i) => (
          <div key={row.name}>
            <div className="flex justify-between items-baseline mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-semibold text-slate-400 w-4 flex-shrink-0">
                  {i + 1}
                </span>
                <span className="data-text text-sm font-medium text-slate-800 truncate">
                  {row.name}
                </span>
              </div>
              <span className="data-text text-sm text-slate-500 flex-shrink-0 ml-3">
                {row.value}
              </span>
            </div>
            <div className="pl-6">
              <div
                className="data-viz h-1.5 bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${row.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Rodapé */}
      <p className="data-text mt-auto text-xs text-slate-400 pt-5 border-t border-slate-100 leading-relaxed">
        {ranking.topShare === null ? (
          "Não há saldo em aberto para os filtros selecionados."
        ) : (
          <>
            Os {CONCENTRATION_TOP_N} maiores {tab === "clientes" ? "devedores" : "empreendimentos"} concentram{" "}
            <strong className="text-slate-600 font-semibold">{ranking.topShare}</strong> do total em aberto — risco de concentração {ranking.risk}.
          </>
        )}
      </p>
    </div>
  );
}
