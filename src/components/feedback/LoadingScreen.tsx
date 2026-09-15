// Tela exibida enquanto os dados são carregados pela primeira vez.
export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-6 text-center" role="status" aria-live="polite">
      <svg className="w-8 h-8 text-purple-600 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
      </svg>
      <p className="font-display text-base font-semibold text-slate-800">Carregando dados da carteira...</p>
      <p className="text-sm text-slate-400 max-w-sm">
        Na primeira visita os dados são baixados. Nas próximas, o painel abre direto com a última atualização.
      </p>
    </div>
  );
}
