import { AGING_STYLE } from "./agingStyles";
import type { QueueRow } from "@/types/dashboard";

type ClientDetailsDrawerProps = {
  client: QueueRow | null;
  onClose: () => void;
};

// Gaveta lateral com os detalhes do cliente selecionado na fila.
export default function ClientDetailsDrawer({ client, onClose }: ClientDetailsDrawerProps) {
  return (
    <>
      {/* Fundo escurecido */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          client ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Gaveta */}
      <aside
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          client ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Detalhes do cliente"
        role="dialog"
        aria-modal="true"
      >
        {client && (
          <>
            {/* Cabeçalho */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start gap-4 flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight font-display">
                  {client.name}
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  {client.enterprise} ·{" "}
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${AGING_STYLE[client.aging]}`}>
                    {client.aging} dias
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
                aria-label="Fechar painel"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Corpo */}
            <div className="flex-1 overflow-y-auto p-6 pb-8 space-y-6">
              {/* Resumo */}
              <div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Saldo em aberto",  value: client.balance },
                    { label: "Valor atualizado", value: client.updatedBalance },
                    { label: "Maior atraso",     value: `${client.maxDaysOverdue} dias` },
                    { label: "Documentos",       value: `${client.docs} em aberto` },
                    { label: "Total pago",       value: client.paid },
                    { label: "Último pagamento", value: client.lastPayment ?? "Nenhum" },
                  ].map((f) => (
                    <div key={f.label} className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs text-slate-500 font-medium">{f.label}</p>
                      <p className="text-base font-semibold text-slate-900 mt-1">{f.value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Valor atualizado = saldo + correção monetária + multa de 2% + juros de 1% ao mês.
                </p>
              </div>

              {/* Documentos em aberto */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3 font-display">
                  Documentos em aberto
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {client.openDocs.map((doc) => (
                    <div key={doc.id} className="flex justify-between items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{doc.ref}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Venc. {doc.due}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{doc.value}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Atualizado {doc.updatedValue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Histórico de pagamentos */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3 font-display">
                  Histórico de pagamentos
                </h4>
                {client.paymentHistory.length === 0 ? (
                  <p className="text-sm text-slate-400">Nenhum pagamento registrado.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                    {client.paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex justify-between items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{payment.description}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{payment.date}</p>
                        </div>
                        <span className="text-sm font-semibold text-emerald-700 whitespace-nowrap">{payment.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
