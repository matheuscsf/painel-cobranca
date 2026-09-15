type LoadErrorScreenProps = {
  message: string | null;
  retrying: boolean;
  onRetry: () => void;
};

// Tela exibida quando não foi possível carregar os dados na primeira visita.
export default function LoadErrorScreen({ message, retrying, onRetry }: LoadErrorScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center" role="alert">
        <svg className="w-12 h-12 text-rose-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        </svg>
        <h1 className="font-display text-lg font-bold text-slate-900">Não foi possível carregar os dados</h1>
        <p className="text-sm text-slate-500 mt-2">Verifique sua conexão com a internet e tente novamente.</p>
        {message && <p className="text-xs text-slate-400 mt-3 break-words">Detalhe: {message}</p>}
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-70 transition-colors"
        >
          {retrying ? "Tentando novamente..." : "Tentar novamente"}
        </button>
      </div>
    </div>
  );
}
